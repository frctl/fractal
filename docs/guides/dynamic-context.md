<!-- DOCTOC SKIP -->

# Guide: Dynamic Context Data

Fractal provides the option [to use CommonJS-style modules](/docs/configuration-files.md#javascript-module-format) to define configuration data for components and documentation pages.

Whilst slightly more complex than using JSON or YAML as a data format, it has the advantage of letting you be able to use the full power of JavaScript to generate [context data](/docs/components/context.md) for your components. This can be handy if you want to provide data to your components from an API, or to use a library such as [Faker](https://github.com/marak/Faker.js) to generate placeholder data for your components.

To give some examples of this in action, we will look at a few different ways that we could generate context data for a 'member list' component. The view template for this component looks like this:

```handlebars
<!-- member-list.hbs -->
<ul>
    {{#each members}}
    <li>{{ this.name }}: {{ this.email }}</li>
    {{/each}}
</ul>
```

As you can see, the template loops over the `member` object and for each item outputs a list item containing the member's name and email address.

## Static data example

To provide some simple static [context data](/docs/components/context.md) to render this template with we could use a JS-formatted data file that looks like this:

```js
// member-list.config.js
'use strict';

module.exports = {
	context: {
		members: [
            {
                name: 'Mark Perkins',
                email: 'mark@clearleft.com',
            },
            {
                name: 'Jeremy Keith',
                email: 'jeremy@clearleft.com',
            }
        ]
	}
};
```

That works fine. But what if we wanted to have 10 people in our list? Or even 100? Hard-coding all that data out in our data file would get tedious pretty quickly.

## Generating dynamic data with Faker

To save us hard-coding lots of context data into our data file, we can use the excellent [faker.js](https://github.com/marak/Faker.js) library to generate a list of members for us.

First you'll need to make sure you have installed Faker in your component library project - `npm install faker --save`.

Now let's revisit our `member-list.config.js` file and amend it to dynamically generate a list of members for us.

```js
// member-list.config.js
'use strict';

const faker = require('faker'); // require the faker module
const memberCount = 10; // how many members we should generate data for
const memberData = [];

for (var i = 0; i < memberCount; i++) {
    memberData.push({
        name: faker.name.findName(), // generate a random name
        email: faker.internet.email()  // generate a random email address
    });
}

module.exports = {
	context: {
		members: memberData // use our generated list of members as context data for our template.
	}
};
```

When our component is now rendered with this data, we will get a list of ten members, all with realistic names and email addresses. And if we want to generate 100 list items instead, all we have to do is update the value of the `memberCount` constant to 100.

Obviously this is a simple example, but the principle can often be useful when you want to preview components with large amounts of data in them.

## Using data from an API

If you already have an API for your site or application, and you want to preview your components using 'real' data (or indeed if you want to use content from any other APIs) then you can handle that in your component configuration files too.

The key to this is that if any values in the context data are [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise), Fractal will first wait for those promises to be resolved before rendering the template using the context data. So we can use a Promise-based request module (such as [request-promise](https://github.com/request/request-promise)) to make API requests and then just pass the returned promise into our context data object.

In the following example, we are going to make a request to our fictional members API endpoint, which returns a JSON-encoded list of members.

```js
// member-list.config.js
'use strict';

const request = require('request-promise'); // require the request-promise module

// make the request to the API
const response = request({
    uri: 'http://www.mysite-api.com/members',
    json: true
});

// do some post-processing on the response to wrangle it into the correct format
response.then(function (membersApiData) {
    const memberData = [];
    for (let member of membersApiData) {
        memberData.push({
            name: `${member.firstName} ${member.lastName}`,
            email: member.emailAddress
        });
    }
    return memberData;
});

module.exports = {
	context: {
		members: response // use the response as context data for our template.
	}
};
```

Now when the component is rendered, it will first make an API request to the endpoint and wait for the Promise (and it's associated `then()` step) to be resolved before using the output to pass as context data to the template.
