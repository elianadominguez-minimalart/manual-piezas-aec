# Manual de piezas · Arcor en Casa

Web para diseñadores: elegís qué estás armando (Home, Home event, Recetas, Micrositio o Ficha de producto) y ves las piezas a entregar, separadas por desktop y mobile, con medida, formato, peso máximo y dónde va cada una en el sitio.

Hecha con React + Vite + Tailwind CSS.

## Correrla

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ para subir a cualquier hosting estático
```

## Dónde se edita el contenido

- `src/data.js`: todas las piezas (medidas, formatos, pesos, notas) y las zonas marcadas sobre cada captura.
- `public/img/`: capturas del sitio (.webp, ≤ 100 KB).

Las zonas son `[x, y, ancho, alto]` relativos a la captura (de 0 a 1), tomadas del board "Especificaciones técnicas · Arcor en Casa" en Figma.
