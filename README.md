
# Sitio oficial SFV (GitHub Pages)

Este es un starter simple para publicar el sitio de la **Superliga de Fútbol Valores** en GitHub Pages.

## Publicar en GitHub Pages
1. Crea un repositorio en tu cuenta: `sfv-site` (o el nombre que quieras).
2. Sube TODO el contenido de esta carpeta al repositorio.
3. En GitHub: Settings → Pages → **Deploy from branch** → Branch: `main` → Folder: `/root` → Save.
4. Tu sitio quedará en: `https://TU-USUARIO.github.io/NOMBRE-REPO`

## Cómo actualizar resultados
- Edita `data/partidos.json` y pon los goles (`goals_home` y `goals_away`).
- La **tabla se calcula sola** al cargar la página.
- Agrega nuevas jornadas duplicando objetos dentro del mismo archivo.

## Equipos
- Edita `data/equipos.json` para añadir o cambiar equipos.
- Puedes subir escudos a `assets/logos` y luego referenciarlos si quieres extender la plantilla.

## Colores y estilos
- Cambia colores en `css/styles.css` (variables CSS al inicio).

## Estructura
- `index.html` muestra tabla y próximos partidos.
- `torneo.html` muestra calendario y tabla.
- `equipos.html` lista equipos desde `data/equipos.json`.
