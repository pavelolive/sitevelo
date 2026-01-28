
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

  `rsync ./galleryRoutes.mjs  youruser@ssh.qtrd.fr:/opt/velo-strava-api/routes/`

  `rsync ./server.mjs  youruser@ssh.qtrd.fr:/opt/velo-strava-api/`

  
## Lancer le Backend

  Verifier l'etat
  `pm2 status` 

  Commande d'action :

  `pm2 stop strava-api`

  `pm2 start strava-api`
  
  `pm2 restart strava-api` 
  

## Reset les stats et gpx

  `rm -rf cache/*`
  `rm -rf gpx_files/*` 
  
## Forcer le refresh strava

  `curl -X POST http://localhost:3001/api/strava/refresh` 