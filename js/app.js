$(function () {
    // Strict mode!
    "use strict";

    var
        model,
        octopus,
        view;

    // Model
    model = {
        // This array will hold the cats
        cats: [],
        selectedCat: null,
        init: function () {
            // If no cat data found in localStorage, initialize with starterCats
            if (!localStorage.cats) {
                this.cats = [{
                    name: "Fluffy",
                    imgUrl: "http://lorempixel.com/image_output/cats-q-c-640-480-8.jpg",
                    score: 0
                }, {
                    name: "Murderface",
                    imgUrl: "http://lorempixel.com/image_output/cats-q-c-640-480-7.jpg",
                    score: 0
                }, {
                    name: "Grumpy",
                    imgUrl: "http://lorempixel.com/image_output/cats-q-c-640-480-10.jpg",
                    score: 0
                }, {
                    name: "Fifi",
                    imgUrl: "http://lorempixel.com/image_output/cats-q-c-640-480-4.jpg",
                    score: 0
                }, {
                    name: "Regis",
                    imgUrl: "http://lorempixel.com/image_output/cats-q-c-640-480-5.jpg",
                    score: 0
                }];

                // Store cats in localStorage
                localStorage.cats = JSON.stringify(this.cats);
            } else {
                // Cat data was found in localStorage. GET IT!
                this.cats = JSON.parse(localStorage.cats);
            }

            // Set selected cat to first cat in array
            this.selectedCat = this.cats[0];
        },
        saveCats: function () {
            // Saves cat data to localStorage
            localStorage.cats = JSON.stringify(this.cats);
        }
    };

    // Octopus
    octopus = {
        // Initialize the model, then the view
        init: function () {
            model.init();
            view.init(model.selectedCat);
        },
        // Method to return cats from model
        getCats: function () {
            return model.cats;
        },
        addPointToCat: function (cat) {
            // Increment the cat score
            cat.score++;
            // Save updated score to localStorage
            model.saveCats();
            // Re-render the cat display
            view.renderCatDisplay(cat);
        },
        catSelectionHandler: function (cat) {
            // Set model.selectedCat to the selected cat
            model.selectedCat = cat;

            // Render the display of a single cat
            view.renderCatDisplay(cat);
            view.renderAdminPanel(cat);
        },
        admin: {
            save: function (cat) {
                model.saveCats();
                view.renderCatDisplay(cat);
                view.renderCatList(cat);
                view.hideAdminPanel();
            },
            cancel: function (cat) {
                view.renderAdminPanel(cat);
                view.hideAdminPanel();
            }
        },
        resetCats: function() {
          localStorage.clear();
          this.init();
        }
    }

    // View
    view = {
        init: function (cat) {
            // Declare references to view elements
            this.listOfCats = $("#listofcats");
            this.catImage = $("#display img");
            this.catName = $("#catname");
            this.catScore = $("#catscore");
            this.editButton = $("#editCat");
            this.adminPanel = $("#admin");

            // Render stuff
            this.renderCatList();
            this.renderCatDisplay(cat);
        },
        renderCatList: function () {
            // Declare reference to this (view) to be used inside functions.
            var self = this;

            // Empty the cat list before adding all items in list
            this.listOfCats.empty();

            console.log(octopus.getCats());
            // Loop over cats and add each to the list element
            octopus.getCats().forEach(function (cat) {
                // Add cat button
                self.listOfCats.append("<a href='#' role='button' class='btn btn-default' id='" + cat.name + "'>" + cat.name + "</a>");

                // Bind cat to button to display when clicked
                self.selectCatByName(cat.name).on("click", function () {
                    // Display the cat!
                    octopus.catSelectionHandler(cat);
                });
            });
        },
        renderCatDisplay: function (cat) {
            // Declare reference to this (view) to be used inside functions.
            var self = this;

            // Update the src URL for the cat img
            this.catImage.attr("src", cat.imgUrl);
            // Set cat name
            this.catName.text(cat.name);
            // Set cat score
            this.catScore.text(cat.score);

            // Unbind any previously attached events on img click
            this.catImage.unbind("click");
            // Bind img click to add point to cat
            this.catImage.on("click", function (cat) {
                return function () {
                    // Add point to cat
                    octopus.addPointToCat(cat);
                }
            }(cat));

            // Bind the edit button
            this.editButton.on("click", function() {
                self.renderAdminPanel(cat);
                self.showAdminPanel();
            });
        },
        renderAdminPanel: function (cat) {
            // declare some local variables
            var
                adminCatName = $("#adminCatName"),
                adminCatImgUrl = $("#adminCatImgUrl"),
                adminCatScore = $("#adminCatScore"),
                adminSave = $("#adminSave"),
                adminCancel = $("#adminCancel");

            // Set input values to value from cat
            adminCatName.val(cat.name);
            adminCatImgUrl.val(cat.imgUrl);
            adminCatScore.val(cat.score);

            // Unbind save button
            adminSave.unbind();
            // Bind save button again
            adminSave.on("click", function () {
                // Set cat values from inputs
                cat.name = adminCatName.val();
                cat.imgUrl = adminCatImgUrl.val();
                cat.score = adminCatScore.val();

                // Save the updated cat
                octopus.admin.save(cat);
            });

            adminCancel.on("click", function() {
                // call the octopus to handle the cancel
                octopus.admin.cancel(cat);
            });
        },
        selectCatByName: function (name) {
            // Just doing this to remove funky string concatenation
            // within jQuery selector from code above. Felt like it
            // was making it less readable.
            return $("#" + name);
        },
        showAdminPanel: function () {
            this.adminPanel.show();
            this.editButton.hide();
        },
        hideAdminPanel: function () {
            this.adminPanel.hide();
            this.editButton.show();
        }
    }

    // Everything is declared, now it's time to go!
    octopus.init();

    // Expose API to global scope for resetting data
    window.resetCats = function() {
      octopus.resetCats();
    };
});
