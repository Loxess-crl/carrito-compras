# Prueba Técnica - Aplicación Móvil

Este proyecto es una prueba técnica que utiliza Expo y json-server para proporcionar una aplicación móvil funcional.

## Requisitos

- Node.js instalado en tu máquina.
- Expo CLI: Si aún no lo tienes instalado, puedes hacerlo con el siguiente comando:
  ```bash
  npm install -g expo-cli
  ```

## Clonación del Proyecto

Para empezar, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/Loxess-crl/carrito-compras.git
cd carrito-compras
```

## Instalación de Dependencias

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

## Configuración de la API

El archivo `constants.ts` contiene la configuración de la API URL. Asegúrate de que la variable `API_URL` coincida con la dirección donde estás ejecutando json-server. La configuración de json-server debe ejecutarse de la siguiente manera:

```bash
json-server --watch db.json --port 3000 --host [API_URL]
```

Esto es importante si deseas acceder a la API desde otro dispositivo conectado a la misma red.

## Usuarios para Iniciar Sesión

Los usuarios para el inicio de sesión están definidos en el archivo `db.json`. Puedes revisar y modificar este archivo según sea necesario.

## Ejecución de la Aplicación

Para correr la aplicación en un dispositivo Android, ejecuta el siguiente comando:

```bash
npx expo run:android
```

Asegúrate de tener tu dispositivo Android conectado a tu máquina o de estar utilizando un emulador de Android.

## Conclusión

Gracias por revisar esta prueba técnica. Si tienes alguna pregunta o necesitas más información, no dudes en contactarme.
