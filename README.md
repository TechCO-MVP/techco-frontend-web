Aquí tienes un README actualizado según la información proporcionada, incluyendo los scripts del proyecto, Storybook y Vitest para pruebas:

## Tecnoloías principales

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

- Node.js v18 o superior.
- npm

---

## Instalación

Clona el repositorio y ejecuta los siguientes comandos:

```bash
# Clonar el repositorio
git clone [URL del repositorio]

# Entrar en el directorio
cd [nombre-del-proyecto]

# Instalar dependencias
npm install

```

---

## Uso

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto [TBD]

```plaintext
├── components/       # Componentes reutilizables de la aplicación
├── pages/            # Rutas y páginas de Next.js
├── redux/            # Configuración y slices de Redux
├── dictionaries/     # Archivos de traducción para i18n
├── lib/              # Funciones y utilidades reutilizables
├── __tests__/        # Pruebas unitarias con Vitest
└── stories/          # Historias para Storybook
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
