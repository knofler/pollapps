angular-fullstack-base
======================

This is my customized angular full stack base

Base angular fullstack generated from 

https://github.com/DaftMonk/generator-angular-fullstack

Then couple of modification made to make it usable out of the box,

1. Change made to .yo-rc.json to enable default directory as client/app/ instead of app/components/ , which gives better management for all app related controller and routes and directives in one place.
2. Made some modification to .gitignore so bootstrap files always available after clone.
3. Routes to components directory by default disabled, which disables modal launch from components directory. That enabled, so out of the box modal will be working.
4. ngReact for react component added to angular app through bower, which made ngReact enabled.
5. D3 library injected to index.html 
 <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
6. meSpeak library made available for web audio API
 <script src='http://www.masswerk.at/mespeak/mespeak.js'></script>
7. SimpleWebRTC  Api made available 
 <script src="https://simplewebrtc.com/latest.js"></script> 
8. Other CDN for webRTC made available for easy webrtc connectivity and out of the box access
9. Specific asset folder with certain file type added to dist/files for public access
10. Bootstrap.js enabled by taking bootstrap.js out of bower injection exclusion list.
11. ui.select2 added as bower dependency. ( https://github.com/angular-ui/ui-select2 )
12. ui.sortable added as bower dependency. ( https://github.com/angular-ui/ui-sortable ).
13. ui-select replaced ui.select2.(https://github.com/angular-ui/ui-select).
14. Polymer added as bower dependency (https://github.com/polymer/polymer).
15. Polymer core elements included (bower install --save Polymer/core-elements) and Polymer paper elements included (bower install --save Polymer/paper-elements).
16. Element structure introduced for easy injection of custom polymer element to through out the apps, style sheet being separated and linked to custom polymer element.
17. Gruntfile wiredep excludes polymer and webcomponents to avoid multiple injection of polymer.html "exclude: [/polymer/, /webcomponentsjs/]"
18. Gruntfile modified to add '<%= yeoman.client %>/elements/{,*//*}*.{png,jpg,jpeg,gif,webp,svg,html,js,json}' to include polymer custom elements directory into livereload list.
19. Smooth Scroll menu available for single page application in angular framework,using $location.hash(id) and $anchorScroll() service.
20. reactComponent listed in components/reactComponents/reactClass.js, individual angular directives will have access to these reactClasses through out the app for view rendering.
21. Firebase element added as bower dependency and included in element list for global access through out the app for api connection to firebase as source for data.(bower install --save firebase) && (bower install --save Polymer/firebase-element).
22. Elements directory made available for production apps via grunt, 'elements/**/*' included in public directory by grunt copy task.
23. Firebase element and core ajax element being implemented, api call and data rendering being demonstrated for sample app.
24. All custom elements must be included in elementList after firebase element,core element and paper element.
25. C3.js library added for charting as bower dependency as well as d3 manual cdn pointing removed, as c3 has dependency of d3.
26. Express/multer.js (https://github.com/expressjs/multer) included for file upload,express.js file configured,api route created for form data store and a sample form provided. upload directory set to ./client/assets/images/uploads/ for future inclusion in dist.
27. Nodemailer (https://github.com/andris9/Nodemailer) version 1.3.2 included and configured, global smtpTransfer object created, email api, email modal form and email processing rest Api created and configured, providing valid nodemailer email account will be able to send email out of the box.
28. Global filter included for application: Pagination,advancefilter for multi word search and capitalize for Capitalizing initial.
29. angular-file-upload(https://github.com/nervgh/angular-file-upload) module included as bower dependency, sample upload page setup with drag and drop upload progress and thumbnail included.
30. ngThumb directive included for thumbnail.
31. Cloudinary (http://cloudinary.com/documentation/node_integration#getting_started_guide) nodejs package included and configured for heroku deployment.
32. angular-file-upload -> multer -> Cloudinary -> Upload.Api -> Mongodb -> view
33. Socketio-jwt(https://github.com/auth0/socketio-jwt) enabled for authenticating socket.io
34. UI-Grid (http://ui-grid.info/) implemented as bower dependency(https://github.com/angular-ui/bower-ui-grid).
35. Ramda.js(http://ramdajs.com/0.15/index.html) included for functional programming and data analysis algorithm, such as currying, Monad.
36. Stripe.js implemented for payment gateway(https://stripe.com/docs/api/node).
37. Twilio implemented for communication (https://www.twilio.com/user/account/developer-tools/api-explorer).
38. ElasticSearch implemented for index search and other rapid search features (https://www.npmjs.com/package/elasticsearch).
39. Mysql implemented for transactional databases (https://www.npmjs.com/package/mysql).
40. Request implemented for rest request (https://www.npmjs.com/package/request).
41. 34 Customised directive included.




