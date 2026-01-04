
  # Landing Page Voyage à Vélo

  Repo du site pour le voyage a velo : https://velo.qtrd.fr/

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
 ## Deploying on server

  Depuis le repo en local

  `npm install` 

  `npm run build` 

  `rsync -av --delete dist/ youruser@ssh.qtrd.fr:/var/www/velo.qtrd.fr/` 

  
## Lancer le Backend

  `cd /opt/velo-strava-api` 

  `node server.mjs` 
  