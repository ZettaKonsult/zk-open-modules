/* @flow */

import AWS from 'aws-sdk';
import { authUser } from './awslib';
import config from '../config';

export async function s3Upload(file) {
  if (!await authUser()) {
    throw new Error('User is not logged in');
  }

  const s3 = new AWS.S3({
    params: {
      Bucket: config.s3.BUCKET,
    },
  });
  const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${
    file.name
  }`;

  return s3
    .upload({
      Key: filename,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    })
    .promise();
}
