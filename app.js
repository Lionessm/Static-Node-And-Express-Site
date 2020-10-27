const express = require('express');
const data = require('./data.json');

const app = express();

app.set('view engine', 'pug');

//use a static route and the express.static method to serve the static files located in the public folder
app.use('/static', express.static('public'));

//An "index" route (/) to render the "Home" page with the locals set to data.projects
app.get('/', ( req, res ) =>{
    res.render('index', data);
})
//An "about" route (/about) to render the "About" page
app.get('/about', (req, res) => {
    res.render('about');
})

//Dynamic "project" routes (/project/:id or /projects/:id) based on the id of the project that render a customized version of the Pug project template to show off each project. Which means adding data, or "locals", as an object that contains data to be passed to the Pug template.
app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    const projectData = data.projects;

    for (let i = 0; i < projectData.length; i++) {
        let currentProject = projectData[i];
        if (parseInt(projectId) === parseInt(currentProject.id)) {
           res.render('project', currentProject);
           return;
        }
    }

    res.render('error', {reason: 'Project ID invalid'});
})

// This middleware is called when an error is thrown.
app.use(function(err, req, res, next){
    console.log('err.statusCode', err.statusCode);
    console.log('err.stack', err.stack);

    res.render('error', {reason: 'Status Code: 500'});
});

// This middleware is called when a user tries to load a unknown route.
app.use(function(req,res){
    res.render('error', {reason: 'Status Code: 404'});
});

//Finally, start your server. Your app should listen on port 3000, and log a string to the console that says which port the app is listening to.
app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});