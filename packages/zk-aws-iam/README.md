[![Build Status](https://travis-ci.org/ZettaKonsult/zk-open-modules.png)](https://travis-ci.org/ZettaKonsult/zk-open-modules)

# zk-aws-users

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

## Setup

    import zk-aws-users from '../src'
    const { Account, UserPool } = zk-aws-users({
      AWS_ACCESS_KEY_ID:        '...',
      AWS_ACCOUNT_ID:           '...',
      AWS_MASTER_USER:          '...',
      AWS_MASTER_PASSWORD:      '...',
      AWS_MASTER_POOL_CUSTOMER: '...',
      AWS_MASTER_POOL_PROJECT:  '...',
      AWS_IDENTITY_ID:          '...',
      AWS_UNAUTH_ROLE_ARN:      '...',
      AWS_AUTH_ROLE_ARN:        '...',
    })

## Usage

### Account

    await Account.createAdminUser({
      names: { customer: string, project: string },
      attributes: { [string]: string },
    })

Registers an administrator with the name and password as specified in `src/settings.js`.

    await Account.createUser({
      userName: string,
      names: { customer: string, project: string },
      attributes: { [string]: string },
      password: string
    })

Creates a user with a temporary password.

    await Account.currentUser()             
    const { token, groups } = await Account.loginUser({
      names: { customer: string, project: string },
      userName: string,
      password: string,
    })

Logins a user.

    const { token, groups } = await Account.loginSetFirstPassword({
      names: { customer: string, project: string },
      userName: string,
      attributes: { [string]: string },
      password: string,
      newPassword: string,
    })

Logins a user while replacing a temporary password with a `[newPassword]`.

    await Account.signOutUser()

Signs out the current user.

    await Account.signUp({ ... })

Analogous to `Account.createUser` but sends an e-mail verification link instead of a temporary password.

    await Account.signUpAdminUser()         
    const token = await Account.userToken()

### User pool

    const userName = await UserPool.assignUserToGroup({
      names: { project: string, customer: string },
      groupName: string,
      userName: string
    })

Assigns a user to a group. Expects the group to exist.

    const clientId = await UserPool.clientId({
      names: { project: string, customer: string },
    })

Retrieves the client id of a customer-project user pool.

    const clientName = UserPool.clientName({
      names: { project: string, customer: string },
    })

Retrieves the client name of a customer-project user pool.

    const clientId = await UserPool.createClient({
      names: { project: string, customer: string },
    })

Creates an application client for a customer-project user pool called `[customer]-[project]-client`.

    const domainName = await UserPool.createDomain({
      names: { project: string, customer: string },
    })

Creates a domain for a customer-project user pool called `[customer]-[project]-domain`.

    const groupName = await UserPool.createGroup({
      names: { project: string, customer: string },
      groupName: string,
      precedence: number = 0,
      description: string = ''
    })

Creates a group for a customer-project user pool.

    const { pool, client, domain, group, adminGroup, administrator } = await UserPool.createUserPool({
      names: { project: string, customer: string },
      replyEmail: string,       // The EmailConfiguration.ReplyToEmailAddress for a user pool.
      adminAttributes: {} = {}  // Administrator attributes.
    })

Creates a user-pool complete with a domain, application, adminstrator group and user.

    await UserPool.deleteDomain({
      names: { project: string, customer: string },
    })

Deletes a user pool domain.

    await UserPool.deleteUserPool({
      names: { project: string, customer: string },
    })

Deletes a user pool.

    const name = UserPool.domainName({
      names: { project: string, customer: string },
    })

Retrieves the domain name of a customer-project user pool.

    const pools = await UserPool.listPools()

Lists all the user pools for the AWS account.

    const name = UserPool.poolName({
      names: { project: string, customer: string },
    })

Retrieves the pool name of a customer-project combination.

    const name = await UserPool.userPoolId({
      names: { project: string, customer: string },
    })

Retrieves the pool id of a cutomer-project combination.
