# Gutenberg Block - Carousel #
**Contributors:**      Cyrale  
**Tags:**              WordPress, Plugin, Gutenberg, Container  
**Requires at least:** 4.9  
**Tested up to:**      4.9.8  
**Stable tag:**        1.0.0  
**License:**           GPL2+  
**License URI:**       http://www.gnu.org/licenses/gpl-2.0.html  

## Description ##



## Installation ##

### Manual Installation ###

1. Upload the entire `/gutenberg-block-carousel` directory to the `/wp-content/plugins/` directory.
2. Run `composer insall` inside the plugin directory.
3. Activate Gutenberg Block - Container through the 'Plugins' menu in WordPress.

### Composer installation

```
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/cyrale/gutenberg-block-carousel"
    }
  ]
}
```

1. Add above repository to `composer.json`.
2. Run `composer require cyrale/gutenberg-block-carousel`.
3. Activate Gutenberg Basics through the 'Plugins' menu in WordPress.

## Changelog ##

[See details](https://github.com/cyrale/gutenberg-block-carousel/blob/master/CHANGELOG.md)

## Development ##

This project was bootstrapped with [Create Guten Block](https://github.com/ahmadawais/create-guten-block).

Below you will find some information on how to run scripts.

>You can find the most recent version of this guide [here](https://github.com/ahmadawais/create-guten-block).

### `npm start` ###
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

### `npm run build` ###
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.

### `npm run eject` ###
- Use to eject your plugin out of `create-guten-block`.
- Provides all the configurations so you can customize the project as you want.
- It's a one-way street, `eject` and you have to maintain everything yourself.
- You don't normally have to `eject` a project because by ejecting you lose the connection with `create-guten-block` and from there onwards you have to update and maintain all the dependencies on your own.
