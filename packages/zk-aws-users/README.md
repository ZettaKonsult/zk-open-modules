[![Build Status](https://travis-ci.org/ZettaKonsult/zk-open-modules.png)](https://travis-ci.org/ZettaKonsult/zk-open-modules)

# Authentication

Zetta Konsult's small API towards AWS' (primarily Cognito's) API.

## Responsibilities

### Cognito CRUD
* User pools.
* Client applications.
* User groups.
* Administrator accounts.
* User accounts.

### Authentication

* User registration.
* User authentication.
* CRUD user attributes.
* Password management.

## Pool Structure

The module creates user pools by using a naming schema of two parts: a customer
name and a project name. E.g., for a customer 'Cust' and a project 'Proj',
the associated user pool will be called Proj-Cust.

## Environmental Variables

The module expects the following environmental attributes to be set.

* AWS_ACCESS_KEY_ID
* AWS_ACCOUNT_ID
* AWS_MASTER_USER           // User name.
* AWS_MASTER_PASSWORD
* AWS_MASTER_POOL_CUSTOMER  // Customer name (see 'pool structure').
* AWS_MASTER_POOL_PROJECT   // Project name (see 'pool structure').
* AWS_IDENTITY_ID           // ID (not ARN) of the identity pool used.
* AWS_UNAUTH_ROLE_ARN       // Unauthenticated role ARN for the Identity pool.
* AWS_AUTH_ROLE_ARN         // Authenticated role ARN for the Identity pool.
