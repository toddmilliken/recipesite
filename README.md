# embark
A WordPress starter project by emagine.

## "embark" on a new project
1. Create a new repository here, https://github.com/organizations/emagineusa/repositories/new
2. Clone the repository to your local machine.
3. Download this repository and extract its contents into your local repository.
4. Open the `package.json` file and update the "name" value to whatever you want for your new project. Replace all instances of `https://github.com/emagineusa/embark` with the url to your repo.
5. Open `gulpfile.js` and change `const host = "embark.local";` to whatever your localhost will be for this project. Feel free to change `const protocol = 'http';` to `https` if your project requires it.
6. Open your command line application and `cd` to your repository's directory.
7. Run `npm install`.
8. Run `gulp`.

## Working with WordPress (Method 1)
**NOTE**: The following method only works if your local server setup allows for symbolic links. If you use MAMP, this method is perfect for you. If you are using Vagrant or Docker based setups, then this method **will not work**, as they do not support symlinks. If you use "Local by Flywheel", you can install this addon, https://github.com/getflywheel/local-addon-volumes, which will let you "mount additional directories for your sites".

1. Install WordPress in the root of your repo's directory. The `.gitignore` is set to ignore everything in the repository, except for what it cares about. So, don't worry about WordPress files being committed to your repo.
2. Next you need to make a symbolic link, or symlink, of your project's `build` folder. If you're on a Mac, you can install this service to make things a little easier, https://www.macupdate.com/app/mac/10433/symboliclinker. After it's installed, you can simply right-click on the item you want to make a symlink of, and go to "Services > Make Symbolic Link" and your done. You can make symlinks via the command line as well, if you're into that, http://osxdaily.com/2015/08/06/make-symbolic-links-command-line-mac-os-x/.
3. Rename your symlink to match the value of `name` in your `package.json`.
4. Move your symlink to `/wp-content/themes/`.
5. Log into your site's admin and activate your theme.

Now, as you update your files in the `src` directory, gulp will process them and update the `build` directory. Since our active theme is a symlink of the `build` directory, any changes will be mirrored automatically.

## Working with Patternlab
The [Patternlab](http://patternlab.io/) portion of this repository is entirely optional, and up to the developers to maintain. 

This tool can be leveraged to help project teams in several different ways:

* Designers and developers can have a complete inventory of all the components and design patterns that exist in the design ecosystem. 
* Project teams are encouraged to reuse existing patterns, rather than reinventing the wheel.
* A living styleguide helps teams communicate project jargon and terminology.
* Clients can view completed pages with real content. 
* Project teams can view completed templates with dummy content. 

This project uses the gulp wrapper around patternlab-node core https://github.com/pattern-lab/edition-node-gulp.

Inside the root, there is an additional directory named `/patternlab/`. 

Inside that folder is the default [Patternlab Node - Gulp Edition](https://github.com/pattern-lab/edition-node-gulp) package.json, and a slightly customized configuration file that uses the assets created from our /src/ and /build/ directories for the WordPress theme. 

### How to get started with Patternlab

To get started with Patternlab, follow these instructions:

1. Open your command line application and `cd` to your repository's `/patternlab/` directory.
1. Run `npm install`.
1. Run `gulp patternlab:build` to build the patternlab. 
1. Run `gulp patternlab:serve` to serve up a browsersync local server to view the patternlab and watch for changes. 

### Custom Patternlab Configuration Explained
The `/patternlab/` folder in the root has a slightly customized configuration file, `/patternlab/patternlab-config.json` to integrate the theme's css, fonts, images, and javascript without needing to copy anything to Patternlab. This configuration file has been modified slightly to integrate into our theme build process. 

* Patterns are created inside `/src/_patternlab/`. This is where the patternlab source files are managed for `/_annotations/`, `/_data/`, `/_meta/`, and `/_patterns/`. 
* The configuration file is using the theme's `/build/` directory to copy over the `/css/`, `/fonts/`, `/images/`, and `/javascript/` directories into `/patternlab/public/`. 

In summary, all the work that is done in patternlab is done inside the `/src/_patternlab/` directory.  

The root `/patternlab/` directory is where the tool is installed to compile files and create the pattern library inside `/patternlab/public/`, which can be copied onto a staging server. 

### Editing Patternlab 

All the patterns and data that will need to be modified is in `/src/_patternlab/`.

#### How to modify the colors map and swatches

The colors map is created by modifying the following files:
* `/src/_patternlab/_data/data.json`: Controls the organization of the swatches
* `/src/_patternlab/_patterns/00-atoms/00-global/00-colors.mustache`: Controls the display and iteration of color data that was entered in the above file.
* `/src/sass/config/variables/__colors.scss`: Defines the project colors in the `$theme-colors` sass map, as well as other color variables. Also defines the `$swatches` sass map used for labelling each swatch and its associated background/text colors.

To get started follow these instructions:

1. Open the sass color variables file,`/src/sass/config/variables/__colors.scss`.
1. Configure the `$theme-colors` sass map according to the project's stylesheet.
1. At the bottom of that file, edit the `$swatches` sass map that uses these theme colors and defines the background/text-colors. 
1. When finished, edit `/_patternlab/data/data.json` to define the organization of project's color scheme. Out-of-the-box, the data is structure into `brandColors` and `neutralColors`, but this can be changed or modified to include a different pattern. 
1. After the data is updated, make sure it matches up with the mustache file that displays the swatches in `/src/_patternlab/_patterns/00-atoms/00-global/00-colors.mustache`. 


#### How to modify the fonts and typography

A helpful tool for downloading Google Fonts locally and creating the stylesheets is https://google-webfonts-helper.herokuapp.com/fonts. 

The fonts can be configured by modifying the following files:
* `/src/fonts/*`: Contains all locally hosted font files. This project uses Roboto font files out-of-the-box, generated from the above link. 
* `/src/sass/fonts/*`: Where @font-face stylesheets and rules are defined. This project uses a roboto stylesheet out-of-the-box, generated from the above link. 
* `/src/sass/config/variables/__typography.scss`: Where the font-stacks used for the project are defined. Defines the `$primary-font` and `$secondary-font`, as well as typography sass maps for paragraphs and headings. 
* `/src/sass/patternlab-custom.scss`: Defines the helper classes `.font-primary`, and `.font-secondary` classes used to apply to elements to demonstrate fonts in-use. 
* `/src/_patternlab/_patterns/00-atoms/00-global/01-fonts.mustache`: Controls the HTML display of each font family, using the classes defined from `/src/sass/patternlab-custom.scss`.

To get started follow these instructions:

1. Add any locally hosted fonts into the project's fonts directory `/src/fonts/`. Only `.woff` and `.woff2` are needed to support IE11+. You may use a tool like https://google-webfonts-helper.herokuapp.com/fonts to host the Google Fonts locally.
1. Update the @font-face rules defined in `/src/sass/fonts/*` for each family to reflect your project's typography. Only `.woff` and `.woff2` are needed to support IE11+. It is recommended to separate each font-family into their own sass partial for better organization (example: `_roboto.scss`, `_oswald.scss`, etc).
1. Update `/src/sass/config/variables/__typography.scss` to modify the `$primary-font`, `$secondary-font` and their fallbacks when fonts aren't loaded yet. 
1. Update `/src/sass/patternlab-custom.scss` where the `.font-primary`, and `.font-secondary` classes are defined.
1. Modify `/src/_patternlab/_patterns/00-atoms/00-global/01-fonts.mustache` to reflect all your `.font-primary` and `.font-secondary` classes and their variations for each font weight/style. 

Now typography rules for headings and paragraphs can be modified inside their sass maps inside `/src/sass/config/variables/__typography.scss`.

#### How to modify the buttons

The button system is built using a series of variables, mixins, and placeholder classes to keep things DRY and configurable. 

* `/src/config/variables/components/_buttons.scss`: This is where all button variables and sass maps are defined for the base button class and its variants for solids and outlines.
    * The `%btn-text` placeholder class contains the typography styles of buttons. The `.btn-text` class extends this placeholder class, for situations where you want to add Read More links.
    * The `.btn` class is used to apply a neutral button without any theme branding colors. This base class contains the default padding, border styles, and other common properties that can be extended with modifier classes for each variation. It also extends the `%btn-text` placeholder class to inherit the typography settings. 
	* There are two sass maps for creating the color variations: `$btn-solid-variants` and `$btn-outline-variants`. This solid variants sass map contains the colors for the base `.btn` class that is neutral, along with any additional variants like primary and secondary.
	* Outline variants can be applied by simply adding `-o` to any button variant. For example, `.btn.btn--primary` would be solid, whereas `.btn.btn--primary-o` would be the outline version. 
* `/src/config/extends/_buttons.scss`: Defines the placeholder classes that can be used to make any element have a specific button style.
* `/src/components/_buttons.scss`: Defines the actual classes by extending the placeholder classes. There shouldn't be much going on in this partial aside from extending the placeholders defined in the extends file. 