#Recommender-2 Web User Interface
This is a Ruby on Rails User Interface for the [Ontology Recommender Web Service](https://github.com/marcosmartinezromero/recommender2_web_service).

##Software versions
- Ruby 1.9.3
- Rails 4.1.1

##Project structure
The code has been organized according to the Ruby on Rails project structure. The UI has been designed following the look-and-feel of [BioPortal](http://bioportal.bioontology.org/), by reusing the code and resources (CSS styles, javascripts, images, etc.) available at the [bioportal_web_ui repository](https://github.com/ncbo/bioportal_web_ui). The files that have been specifically created or modified for this project are:

Application controllers, views and routes:

- /app/controllers/application_controller.rb
- /app/controllers/recommender_controller.rb
- /app/views/recommender/index.html.erb
- /config/routes.rb

Javascript:

- /public/javascripts/recommender2/bp_recommender2.js

CSS:

- /public/stylesheets/recommender2.css

##Installation and execution
- Install Ruby on Rails. Take a look at the [Getting Starting with Rails guide](http://guides.rubyonrails.org/getting_started.html).
- Go to the application folder and start the web server by running "rails server".
- Open a browser window and navigate to http://localhost:3000/index.

##Contact
- Marcos Martínez-Romero (marcosmartinez@udc.es)