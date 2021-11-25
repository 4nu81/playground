#!/usr/bin/bash

GREET="Howdy Partner"
echo $GREET

echo "Name: $1";
echo "Age: $2";

while true; do
    read -p "Do you wish to drink a beer?" yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

if [ $2 -lt 16 ] ; then
    echo "You are too young to use this script."
else
    echo "Enjouy your beer $1!"
fi 