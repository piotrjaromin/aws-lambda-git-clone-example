'use strict';

const git = require('simple-git/promise');
const fs = require('fs-extra');

// Set up environment variables so "git" command is available
const lambdaRoot = process.env.LAMBDA_TASK_ROOT;
process.env.PATH = `${process.env.PATH}:${lambdaRoot}/git-dir`;
process.env.GIT_TEMPLATE_DIR = `${lambdaRoot}/git-dir/templates`;
process.env.GIT_EXEC_PATH = `${lambdaRoot}/git-dir/libexec`;

// Entry point for lambda call
exports.lambdaHandler = function(event, context) {

    console.log("Starting lambda");

    // This variables can be set up in AWS Lambda console

    const { gitUser, gitPassword, repoName } = event;
    let repoUrl = `https://${gitUser}:${gitPassword}@github.com/${repoName}.git`;

    if ( !gitUser && !gitPassword ) {
      repoUrl = `https://github.com/${repoName}.git`;
    }

    // To this directory repository contents will be cloned
    // It must be in /tmp directory otherwise lambda will error with  "fatal: could not create work tree dir 'cloned_code': Read-only file system"
    const destPath = "/tmp/cloned_code"

    console.log("variables set, performing clone");
    // execute clone command and print files
    return git()
        .silent(true)
        .clone(repoUrl, destPath)
        .then(() => fs.readdir(destPath))
        .then(console.log);
}

