#!/usr/bin/env bash
# If you do not have composer installed. Check out the following documentation
# @see https://getcomposer.org/doc/00-intro.md#installation-linux-unix-osx
# @see https://getcomposer.org/doc/00-intro.md#installation-windows

# Check if we have a "composer.json" file
# and verify the "composer.lock" files does not exist.
if [ -e composer.json ] && [ ! -e composer.lock ]; then
  # Update Composer to install PHP_CodeSniffer
  composer update

  # Add WordPress Coding Standards Rules
  composer create-project wp-coding-standards/wpcs:dev-master --no-dev

  # Make PHP CodeSniffer aware of the WordPress Coding Standards rules.
  vendor/bin/phpcs --config-set installed_paths wpcs

  # Create .git > hooks directory if doesn't exist already
  mkdir -p .git/hooks

  # Move into the .git > hooks directory
  cd .git/hooks

  # Check if the pre-commit file exists, if not make one.
  if [ ! -e pre-commit ]; then
    # Clone our baseline pre-commit file into the "em-wp-pre-commit"
    git clone https://gist.github.com/b96cf46393d8bbd1044cd3c6aa090295.git em-wp-pre-commit

    # Move the "pre-commit" file into the parent directory
    mv em-wp-pre-commit/pre-commit ./

    # Give the pre-commit file the proper permissions
    chmod +x pre-commit

    # Get rid of the "em-wp-pre-commit" folder
    rm -rf em-wp-pre-commit
  fi
else
  echo "Either compser has been updated already or you there is no composer.json file available"
fi
