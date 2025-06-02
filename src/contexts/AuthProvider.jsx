import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import authService from '../services/authService';
import { normalizeUserType } from '../utils/userTypeUtils';
import { useNotifications } from './NotificationContext';

export function AuthProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(null);
  
  // Estado que indica si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  // Estado de carga
  const [loading, setLoading] = useState(true);
  
  // Acceder al sistema de notificaciones
  const { showSuccess } = useNotifications();

  // Cargar el usuario cuando el componente se monte
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);

      console.log('Login exitoso, datos recibidos:', data);

      // El token ya se guarda en una cookie HttpOnly
      // Extraer tipo de usuario del mensaje (formato: '{userType} login successful')
      const messageUserType = data.message?.split(' ')?.[0] || '';
      
      // Ahora usaremos el tipo de usuario y los datos básicos para construir un usuario provisional
      const userType = normalizeUserType(data.userType || messageUserType || localStorage.getItem('userType') || 'clients');
      const userId = data.userId || localStorage.getItem('userId') || 'unknown';
      
      console.log('Tipo de usuario detectado:', userType);
      
      // Construir un objeto de usuario básico
      const basicUser = {
        _id: userId,  // Usando _id para coincidir con la estructura MongoDB
        id: userId,   // Por compatibilidad
        userType: userType,
        email: email,
        name: 'Usuario ' + userType  // Nombre provisional hasta cargar el perfil completo
      };
      
      // Primero establecer usuario básico y autenticación
      setUser(basicUser);
      setIsAuthenticated(true);
      
      // Mostrar notificación de inicio de sesión exitoso
      showSuccess(`¡Bienvenido/a ${email}!`, 'Sesión iniciada');
      
      // IMPORTANTE: Usar Promise para garantizar que los estados se actualicen completamente
      // antes de resolver la promesa del login
      return new Promise((resolve) => {
        // Establecer timeout corto para permitir que React actualice el estado
        setTimeout(async () => {
          try {
            console.log('Intentando cargar perfil completo del usuario...');
            const profileData = await authService.getCurrentUser();
            console.log('Perfil recibido:', profileData);
            
            if (profileData) {
              setUser(profileData);
            }
          } catch (profileError) {
            console.warn('No se pudo cargar el perfil completo del usuario:', profileError);
            // Mantenemos el usuario básico
          } finally {
            setLoading(false);
            resolve(data);
          }
        }, 100);
      });
    } catch (error) {
      console.error('Error en login:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      
      // Guardar el nombre del usuario antes de cerrar sesión para la notificación
      const userName = user?.name || 'Usuario';
      
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      
      // Mostrar notificación de cierre de sesión exitoso
      showSuccess(`¡Hasta pronto, ${userName}!`, 'Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para simular sesión (solo para demo)
  const simulateSession = () => {
    const demoUser = {
      id: '123456789',
      name: 'Usuario Demo',
      email: 'usuario@ejemplo.com',
      userType: normalizeUserType('clients'),
      avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=0D8ABC&color=fff',
      // Datos adicionales que podría necesitar el perfil
      phoneNumber: '123-456-7890',
      address: 'Calle Ejemplo 123',
      birthdate: '1990-01-01'
    };
    
    // Establecer el tipo de usuario en localStorage para simulación
    localStorage.setItem('userType', normalizeUserType('clients'));
    localStorage.setItem('userId', '123456789');
    setUser(demoUser);
    setIsAuthenticated(true);
    
    // Mostrar notificación de inicio de sesión de demostración
    showSuccess('¡Bienvenido/a Usuario Demo!', 'Sesión de demostración iniciada');
  };

  // Función para registrar usuario sin iniciar sesión automáticamente
  const registerAndLogin = async (userData) => {
    try {
      setLoading(true);
      // 1. Registrar el usuario
      const registerResponse = await authService.registerClient(userData);
      console.log('Registro exitoso:', registerResponse);
      
      // No hacer login automáticamente, esperar verificación por código
      setLoading(false);
      
      // Devolver la respuesta indicando que se requiere verificación
      return {
        ...registerResponse,
        requiresVerification: true,
        message: 'Se ha enviado un código de verificación a tu correo electrónico. Por favor verifica tu cuenta.'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      setLoading(false);
      throw error;
    }
  };

  // Función para verificar el código de correo electrónico
  const verifyEmailCode = async (verificationCode) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmailCode(verificationCode);
      
      if (response && response.client) {
        // Construir objeto de usuario con los datos del cliente verificado
        const verifiedUser = {
          _id: response.client.id || response.client._id,
          id: response.client.id || response.client._id,
          userType: normalizeUserType('clients'),
          email: response.client.email,
          name: response.client.name || 'Usuario verificado'
        };
        
        // Actualizar el estado
        setUser(verifiedUser);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      console.error('Error en verificación de código:', error);
      setLoading(false);
      throw error;
    }
  };

  // Proporcionar los valores y funciones del contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    simulateSession,
    registerAndLogin,
    verifyEmailCode,
    userType: authService.getUserType()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
