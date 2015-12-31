# SimpleFace Config

Website to configure the [simpleface](https://github.com/mfinelli/simpleface)
[pebble](https://www.pebble.com) watchface.

## Dependencies

The final website is just plain HTML, CSS, and JavaScript, however these
components are written using [jade](http://jade-lang.com),
[sass](http://sass-lang.com), and [coffee script](http://coffeescript.org/).

Therefore, you will need [nodejs](https://nodejs.org) and
[npm](https://www.npmjs.com). You can also use [gulp](http://gulpjs.com) to
automatically build, combine, minimize, and gzip everything.

We also use [bower](http://bower.io) to fetch front-end dependencies.
Specifically we use the pebble developed
[slate](https://github.com/pebble/slate) project.

## Usage

First install the node dependencies:

```shell
$ npm install
```

Then install the bower dependencies:

```shell
$ bower install
```

Now you can build all of the fils. If you are using the gulp task simply run:

```shell
$ gulp
```

Which will generate all of the production-ready files and place them in `web`.

After you have generated all of the production files and deployed them to
your server you will need to update the configuration URL in the main
watchface javascript file:

```javascript
Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('https://yourhostedsite.com');
});
```

## License

Licensed under the terms of the Affero General Public License v3. For more
information see the `LICENSE` file included with the project or
[AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html).

