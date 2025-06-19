## Tecnologías principales

- **Framework**: [Next.js v15](https://nextjs.org/) 
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) 
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de estado**: [Redux](https://redux.js.org/) 
- **Validación**: [Zod](https://zod.dev/)
- **Gestión de datos**: [Tanstack React Query](https://tanstack.com/query/latest)
- **Internacionalización (i18n)**: Soporte multilingüe con middleware + `@formatjs/intl-localematcher` y `negotiator`.
- **Pruebas**: [Vitest](https://vitest.dev/).
- **Storybook**: [Storybook](https://storybook.js.org/)

---

## Requisitos previos

- Node.js v18.18 o superior.
- npm

---

## Instalación

Clona el repositorio y ejecuta los siguientes comandos:

```bash
# Clonar el repositorio
git clone git@github.com:TechCO-MVP/techco-frontend-web.git

# Entrar en el directorio
cd techco-frontend-web

# Instalar dependencias
npm install --legacy-peer-deps

```

### Notas sobre `--legacy-peer-deps`

El uso del parámetro `--legacy-peer-deps` durante la instalación de las dependencias es necesario debido a la reciente publicación de [React 19](https://github.com/facebook/react/releases) el 5 de diciembre de 2024. Muchas dependencias de terceros aún no han actualizado sus configuraciones de compatibilidad (`peerDependencies`) para incluir esta nueva versión de React. 

Sin este parámetro, es probable que `npm` arroje errores de incompatibilidad al instalar paquetes que todavía especifican versiones más antiguas de React como requisito en sus `peerDependencies`.

El flag `--legacy-peer-deps` fuerza a `npm` a ignorar estos conflictos y a instalar las dependencias necesarias, aunque no cumplan estrictamente con las versiones especificadas en los `peerDependencies`.

Una vez que las bibliotecas utilizadas en este proyecto actualicen sus configuraciones para ser compatibles con React 19, este flag ya no será necesario.

---

## Uso

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto

```plaintext
├── .storybook/       # Configuración específica de Storybook
├── actions/          # Server actions
├── app/              # Rutas y páginas de Next.js
├── components/       # Componentes reutilizables de la aplicación
├── dictionaries/     # Archivos de traducción para i18n
├── lib/              # Funciones y utilidades reutilizables
└── __tests__/        # Pruebas unitarias con Vitest
```

---

## Storybook

Este proyecto utiliza [Storybook](https://storybook.js.org/) para documentar y probar componentes.

### Ejecutar Storybook

```bash
npm run storybook
```

Abre [http://localhost:6006](http://localhost:6006) para explorar los componentes.

## Pruebas

Este proyecto utiliza [Vitest](https://vitest.dev/) para realizar pruebas unitarias y de cobertura.

### Ejecutar todas las pruebas

```bash
npm run test
```

### Generar reporte de cobertura

```bash
npm run test:coverage
```

Los resultados se guardarán en la carpeta `coverage/`.

---

## Scripts disponibles

- `dev`: Inicia el servidor de desarrollo.
- `build`: Construye la aplicación para producción.
- `start`: Inicia la aplicación en modo de producción.
- `lint`: Ejecuta ESLint para verificar problemas en el código.
- `test`: Ejecuta las pruebas con Vitest.
- `test:coverage`: Genera el reporte de cobertura de pruebas.
- `storybook`: Inicia Storybook en modo de desarrollo.
- `build-storybook`: Genera una versión estática de Storybook.
