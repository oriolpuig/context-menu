var ghpages = require('gh-pages'),
    path = require('path');

ghpages.publish(path.join(__dirname, 'dist'));