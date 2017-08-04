# Fims QuickStart

## Setup

* Ensure you have Node 6.10.0+ and NPM 3+ installed.
* Install Node packages `npm i`

## Development
* Follow instructions at https://github.com/mifosio/demo-server and start demo-server
* Run local dev environment `npm run dev`
* Go to http://localhost:4200

## Production build
* Run license check `npm run checkLicenses`
* Run in production mode `npm run runProd`. This is only to test if AOT is working and should never be used in a production environment.
* Build production assets `npm run build`. Files will be stored under /dist.

## Tests
* Please follow the best practices here [Angular Testing](https://angular.io/docs/ts/latest/guide/testing.html)
* Run karma tests `npm run test`


## Versioning
The version numbers follow the [Semantic Versioning](http://semver.org/) scheme.

In addition to MAJOR.MINOR.PATCH the following postfixes are used to indicate the development state.

* snapshot - A release currently in development. 
* m - A _milestone_ release include specific sets of functions and are released as soon as the functionality is complete.
* rc - A _release candidate_ is a version with potential to be a final product, considered _code complete_.
* ga - _General availability_ indicates that this release is the best available version and is recommended for all usage.

The versioning layout is {MAJOR}.{MINOR}.{PATCH}-{INDICATOR}[.{PATCH}]. Only milestones and release candidates can  have patch versions. Some examples:

1.2.3-snapshot  
1.3.5-m.1  
1.5.7-rc.2  
2.0.0-ga

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md) file.

## License
See [LICENSE](LICENSE) file.
