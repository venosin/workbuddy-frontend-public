import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import authService from '../services/authService';

export function AuthProvider({ children }) {
  // Estado del usuario
  const [user, setUser] = useState(null);
  
  // Estado que indica si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  // Estado de carga
  const [loading, setLoading] = useState(true);

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
      const userType = data.userType || messageUserType || localStorage.getItem('userType') || 'client';
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
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
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
      userType: 'client',
      avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=0D8ABC&color=fff',
      // Datos adicionales que podría necesitar el perfil
      phoneNumber: '123-456-7890',
      address: 'Calle Ejemplo 123',
      birthdate: '1990-01-01'
    };
    
    // Establecer el tipo de usuario en localStorage para simulación
    localStorage.setItem('userType', 'client');
    localStorage.setItem('userId', '123456789');
    setUser(demoUser);
    setIsAuthenticated(true);
  };

  // Función para registrar y autenticar en un solo paso
  const registerAndLogin = async (userData) => {
    try {
      setLoading(true);
      // 1. Registrar el usuario
      const registerResponse = await authService.registerClient(userData);
      console.log('Registro exitoso:', registerResponse);
      
      // 2. Iniciar sesión automáticamente
      const loginData = await authService.login(userData.email, userData.password);
      
      // 3. Construir objeto de usuario usando los datos de registro y login
      const userId = loginData.userId || registerResponse.userId || 'unknown';
      const userType = loginData.userType || 'client';
      
      // 4. Crear un objeto de usuario inicial con los datos del registro
      const newUser = {
        _id: userId,
        id: userId,
        userType: userType,
        email: userData.email,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        birthday: userData.birthday
      };
      
      // 5. Actualizar el estado
      setUser(newUser);
      setIsAuthenticated(true);
      setLoading(false);
      
      return registerResponse;
    } catch (error) {
      console.error('Error en registro con autenticación:', error);
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
    userType: authService.getUserType()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
