/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, you might want to read it really slow, don't worry be happy
in every line there may be trouble, but if you worry you make it double, don't worry, be happy
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, be happy
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just API…
I need this code, just don't know where, perhaps should make some middleware, don't worry, be happy

Go code!
*/
const express = require('express');
// const postRoutes = require('./posts/postRoutes');
// const path = require('path');

const actionModel = require('./data/helpers/actionModel.js')
const projectModel = require('./data/helpers/projectModel.js')

// creates an express application using the express module
const server = express();
const cors = require('cors')


function validateProjectId(request, response, next) {
    const id = request.body.project_id 
    projectModel.get(id)
    .then(project => {
    if (project) {
        request.project = project
        next()
    }
    else {
        response.status(400).json({message: "Invalid project ID"})
        next()
    }
  }) 
}

server.use(express.json());
server.use(cors())

//CRUD for actions
server.post('/actions', validateProjectId, (request, response) => {
    const newAction = request.body
    actionModel.insert(newAction)
    .then(actions => {
        if(actions) {
            response.status(201).json(actions)
        }
    })
    .catch(error => {
        response.status(500).json({ error: "There was an error while saving the action to the database" })
    })
})
server.get('/actions', (request, response) => {
    actionModel.get()
    .then(actions => {
        if(actions) {
            response.status(200).json(actions)
        }
    })
    .catch(error => {
        response.status(500).json({ error: "The actions information could not be retrieved." })
    })  
})
server.put('/actions/:actionid', (request, response) => {
    const updatedAction = request.body
    
    actionModel.update(request.params.actionid, updatedAction) 
    .then(actions => {
        if(actions) {
            response.status(200).json(actions)
        }
        else {
            response.status(404).json({ message: "The action with the specified ID does not exist." })
        }
    })
    .catch(error => {
        response.status(500).json({error: "The action information could not be modified."})
    })
})
server.delete('/actions/:actionid', (request, response) => {
    actionModel.remove(request.params.actionid) 
    .then(actions => {
        if(actions) {
            response.status(200).json({message: "The action has been deleted"})
        }
        else {
            response.status(404).json({ message: "The action with the specified ID does not exist." })
        }
    })
    .catch(error => {
        response.status(500).json({ error: "The action could not be removed" })
    })
})
//CRUD for projects
server.post('/projects', (request, response) => {
    const newProject = request.body
    projectModel.insert(newProject)
    .then(projects => {
        if(projects) {
            response.status(201).json(projects)
        }
    })
    .catch(error => {
        response.status(500).json({ error: "There was an error while saving the project to the database" })
    })
})
server.get('/projects', (request, response) => {
    projectModel.get()
    .then(projects => {
        if(projects) {
            response.status(200).json(projects)
        }
    })
    .catch(error => {
        response.status(500).json({ error: "The projects information could not be retrieved." })
    })  
})
server.put('/projects/:id', validateProjectId, (request, response) => {
    const updatedProject = request.body
    projectModel.update(request.params.id, updatedProject) 
    .then(projects => {
        if(projects) {
            response.status(200).json(projects)
        }
    })
    .catch(error => {
        response.status(500).json({error: "The project information could not be modified."})
    })
})
server.delete('/projects/:id', validateProjectId, (request, response) => {
    projectModel.remove(request.params.id) 
    .then(projects => {
        if(projects) {
            response.status(200).json({message: "The project has been deleted"})
        }
    })
    .catch(error => {
        response.status(500).json({ error: "The project could not be removed" })
    })
})

//Retrieve a list of actions for a project
server.get('/projects/:id/actions', (request, response) => {
    const id = request.params.id
    console.log(id)
    projectModel.getProjectActions(id) 
    .then(actions => {
        if(actions) {
            response.status(200).json(actions)
        }
    })
    .catch(error => {
        response.status(500).json({ error: "The list of actions could not be retrieved" })
    })
})

server.listen(8000, () => console.log('Success: API Running on Port 8000'))