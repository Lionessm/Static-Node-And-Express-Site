const express = require('express');
const data = require('./data.json');

const app = express();

app.set('view engine', 'pug');

// Static route and the express.static method used to serve the static files located in the public folder.
app.use('/static', express.static('public'));

// An "index" route (/) to render the "Home" page with the locals set to data.projects.
app.get('/', ( req, res ) =>{
    res.render('index', data);
})
// An "about" route (/about) to render the "About" page.
app.get('/about', (req, res) => {
    res.render('about');
})

// Dynamic "project" routes (/project/:id or /projects/:id) based on the id of the project that render a customized version of the Pug project template to show off each project.
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

    let error = new Error();
    error.status = 404;
    error.message = "Project not found based on the provided ID!";

    res.render('error', {reason: 'Project ID invalid', error: error});
})

// This middleware is called when an error is thrown.
app.use(function(err, req, res, next){
    console.log("err", err);

    let error = new Error();
    error.status = 500;
    error.message = "Something went bad man, watchout!";

    res.render( 'error', { reason: `Status Code: 500`, error: error });
});

// This middleware is called when a user tries to load a unknown route.
app.use(function(req,res){
    let error = new Error();
    error.status = 404;
    error.message = "Sorry cant find that!";
    res.render('page-not-found', { reason: 'Status Code: 404', error: error });
});


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});