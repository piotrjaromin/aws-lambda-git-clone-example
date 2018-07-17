# aws-lambda-git-clone-example

Simple example of lambda which is capable of cloning git repositories.
It can be used as example for using any binary file which should be called by lambda code.

Git binaries are stored in `git-dir` and they are copied from instance created by [amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2](https://console.aws.amazon.com/ec2/v2/home#Images:visibility=public-images;search=amzn-ami-hvm-2017.03.1.20170812-x86_64-gp2) AMI. This AMI is used as execution environment for lambda, so any binary which works under it, can also be executed by lambda, more is in [documentation](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html).

`git-dir/templates` directory is required by git binary, but for this example it can be empty.

Lambda clones repository based on data in invocation request.


## Building

```bash
npm install
npm run zip
```

This will create zip file which can be uploaded to AWS.

We also need to create role for lambda:

```bash
aws iam create-role \
--role-name git-clone-lambda-role \
--assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'
```

Copy arn of create role and paste it in below command for the upload zip and lambda creation:

```bash
aws lambda create-function \
--function-name git-clone-lambda \
--runtime nodejs8.10 \
--role ARN_FROM_PREVIOUS_COMMAND \
--handler index.lambdaHandler \
--zip-file fileb://lambda-code.zip
```

## Invoking

Command which can invoke lambda ( can also be done from aws console )

```bash
aws lambda invoke \
--function-name git-clone-lambda \
--payload '{
    "gitUser": user_name,
    "gitPassword": password,
    "repoName": "repoOwner/repoName"
}' \
output.json
```

Calling this lambda multiple times can return error:
`fatal: destination path '/tmp/cloned_code' already exists and is not an empty directory.`.

The reason is that, we are not cleaning cloned directory, and despite what we might think of lambda if we run them multiple times in short amount of time we might be learn that they do have some state (although unstable).

If you want to know more I have wrote [post about it](https://piotrjaromin.pl/aws/lambda/git/nodejs/serverless/deploy/binary/executable/2018/07/17/serverless-with-git.html)

