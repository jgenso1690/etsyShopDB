# etsyShopDB

At commercetools we thrive in a microservice environment, and in the past have had to build "connector" services that integrate 2 or more systems. The problem below is fictitious, but it should allow you to demonstrate your skills in a language of your choice.

Please write an application that, when given a list of Etsy Shop IDs as a parameter, does the following:

Synchronizes the shop's listings to several files (one per shop ID), outputting what has been added or removed since the last run.
The output might look something like this:

Shop ID 234234
- removed listing 234987 "Cool cat shirt"
+ added listing 98743598 "Cooler cat shirt"

Shop ID 9875
No Changes since last sync

Shop 93580
+ added listing 3094583 "Artisanal cheese"
You can find a shopId at Etsy's https://www.etsy.com/developers/documentation/reference/shop#method_findallshops /shops/ endpoint.

Guidelines:
All work should be done in a private GitHub repository.
Include a readme with instructions on how to run the application.
We prefer JavaScript, Python, or a comparable scripting language, but you may use any language you want, with any libraries you want.
Try to spend no more than 4-6 hours on this; don't worry if you don't finish! That's okay too.
If you really want to, you can spend more time, but please let us know if you do.
If you have time, or want to show off, include tests!
When you finish the application please update the readme including a discussion of:

Challenges you ran into
Areas of the code you are most proud of
Areas of the code you are least proud of
Tradeoffs you were forced to make
Any other notes you'd like to share
Finally, include a discussion of next steps required to develop this into a microservice responsible for syncing listing information to a database. This is entirely open-ended, so feel free to share an approach you may have tried before or just something you'd be interested in developing. Be sure to cover:

Deploying the service
How the service's functionality might be triggered
How the service's result data would be stored/retrieved
Code changes or other additions required to achieve the above
...and then invite us to the repo!