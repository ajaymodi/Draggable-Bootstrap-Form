demo_app
========

build bootstrap based form by drag and drop


Features.
The following are the user-stories for this project:

1. Add in multiple field types shown below
a. Radio buttons
b. Drop down combos
c. Date pickers
d. Email address
e. Checkboxes
f. Textboxes
g. Phone number input - like HTML5
h. Custom submit buttons
i. conditional fields and many more.

2. Allow Administrator to change the number of columns (minimum 1 and maximum 5).

3. Allow Administrator to upload a background image for the form/page.

4. Allow Administrator to create, update, delete multiple such forms. - Using MongoDB as persistent storage.

5. All fields should have its field type validations by default.

6. Allow Administrator to place an error messages element at the top or bottom where all the validation errors are shown. It an error message element is not present - the error should be shown besides the field.

8. Allow user (End user) to open the form and give feedback on the same. Admin can view responses.


Technology used:
ruby, sinatra, mongo, bootstrap 3, jquery.

Steps to install.
prerequirements - ruby, mongo server

Installation step:-
1. allow .rvmrc file to setup the system
2. setup config.yml with content of database
3. bundle exec thin -R config.ru start -p PORT

and access the product with server_path/port(http://localhost:4000 as for eg.)




