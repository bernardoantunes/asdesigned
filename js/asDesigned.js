/*
*
*  AsDesigned (0.09) 		<http://#################.com/>
*  by Bernardo Antunes 		<http://bernardoantunes.com/>
*  licensed under MIT 		<http://opensource.org/licenses/mit-license.php>
*	
*/

//
// mediaRule: ex: "@media screen and (min-width: 8.0 em)"
// factor: 1.0
//
function updateMediaRuleEmByFactor(mediaRule, factor) {

    //RegExp to obtain the value of the ems.
    var regExp = /(\d+(\.?\d+))(?=em)/ig;

    var result = mediaRule.replace(regExp, function (matchedValue) {
        return parseFloat(matchedValue) * factor;
    });

    return result;
}

//This function gets the media rule from the array, but it needs to make a test to support ie.
//Yes, it can be optimized. But for the proof of context is enough. :) 
function getMediaRuleItem(mediaRules, index)
{
    return mediaRules[index] != undefined ? mediaRules[index] : mediaRules.item(index);
}

//The media rule Sufix used to cancel the original rules.
var mediaRuleSufix = " and (max-width: 0px)";
function isMediaRuleSufixed(mediaRule) {
    return mediaRule.indexOf(mediaRuleSufix) !== -1;
    //return mediaRule.slice(-mediaRuleSufix.length) == mediaRuleSufix;
}

//Returns the media rule without the Sufix.
function removeMediaRuleSufix(mediaRule) {
    return mediaRule.replace(mediaRuleSufix,'');
    //if(isMediaRuleSufixed(mediaRule))
    //    return mediaRule.slice(0, mediaRule.length - mediaRuleSufix.length);
    //return mediaRule;
}

//Returns the media rule with the Sufix.
function addMediaRuleSufix(mediaRule) {
    return mediaRule + mediaRuleSufix;
}

//Updates All the media Em value by a factor.
function updateMediaRulesEmByFactor(factor) {
    var styleSheets = document.styleSheets;
    var cssRules, cssRule, mediaRules, mediaRulesOriginalValues = null;
    //Vamos percorrer todos os styleSheets.
    for (i = 0; i < styleSheets.length; i++) {

        //Vamos obter a lista de CSSRules no StyleSheet em contexto.
        cssRules = document.styleSheets[i].cssRules;

        if(cssRules != null) {

            //Vamos percorrer todos as cssRules.
            for (j = 0; j < cssRules.length; j++) {
                cssRule = cssRules[j];
                //MediaList
                mediaRules = cssRule.media;
                //Apenas se for uma CSSMediaRule.
                if (mediaRules != undefined) {

                    //----------------------------------------------------------------------
                    //console.log("mediaRules.length = %d;", mediaRules.length);
                    var isFirstTime = !isMediaRuleSufixed(getMediaRuleItem(mediaRules, 0));
                    var originalLenght = mediaRules.length / (isFirstTime ? 1 : 2);

                    //First lets create a list with the original values.
                    var mediaRulesOriginalValues = new Array();
                    for(k = 0; k < originalLenght; k++) {
                        mediaRulesOriginalValues.push(removeMediaRuleSufix(getMediaRuleItem(mediaRules, k)));
                    }

                    //If the adjustment is one, we can clean the adjustments altogether
                    if(factor === 1) {
                        //Only correct if the values were already changed before.
                        if(!isFirstTime)
                        {
                            //Lets add the original rules.
                            for(k = 0; k < originalLenght; k++) {
                                mediaRules.appendMedium(mediaRulesOriginalValues[k]);
                            }

                            //Lets remove all other rules.
                            for(k = 0; k < (originalLenght * 2); k++) {
                                mediaRules.deleteMedium(getMediaRuleItem(mediaRules, 0));
                            }

                        }
                    }
                    //If there is an adjustment to be made.
                    else {
                        if(!isFirstTime) {
                            //We delete previous adjustments.
                            for(k = 0; k < originalLenght; k++) {
                                //Add the new mediarule.
                                mediaRules.deleteMedium(getMediaRuleItem(mediaRules, originalLenght));
                            }
                        }
                        else {
                            //Lets add original rules Sufixed so that they return false.
                            for(k = 0; k < originalLenght; k++) {
                                mediaRules.appendMedium(addMediaRuleSufix(mediaRulesOriginalValues[k]));
                            }
                        }
                        
                        //And add the new adjustments.
                        for(k = 0; k < originalLenght; k++) {
                            //Add the new mediarule.
                            mediaRules.appendMedium(updateMediaRuleEmByFactor(mediaRulesOriginalValues[k], factor));
                        }

                        //Lets delete the original values.
                        if(isFirstTime) {
                            //Lets remove the original rules.
                            for(k = 0; k < originalLenght; k++) {
                                mediaRules.deleteMedium(getMediaRuleItem(mediaRules, 0));
                            }
                        }
                    }
                    //----------------------------------------------------------------------

                }
            }
        }
    }
}

// //Updates All the media Em value by a factor.
// function updateMediaRulesEmByFactor(factor) {
//     var styleSheets = document.styleSheets;
//     var cssRules, cssRule, mediaRules, mediaRulesOriginalValues = null;
//     //Vamos percorrer todos os styleSheets.
//     for (i = 0; i < styleSheets.length; i++) {

//         //Vamos obter a lista de CSSRules no StyleSheet em contexto.
//         cssRules = document.styleSheets[i].cssRules;

//         if(cssRules != null) {

//             //Vamos percorrer todos as cssRules.
//             for (j = 0; j < cssRules.length; j++) {
//                 cssRule = cssRules[j];
//                 //MediaList
//                 mediaRules = cssRule.media;
//                 //Apenas se for uma CSSMediaRule.
//                 if (mediaRules != undefined) {
//                     mediaRulesOriginalValues = mediaRules.originalValues;

//                     //Se ainda nao tivermos guardado os valores originais, vamos guarda-los.
//                     if (mediaRulesOriginalValues == undefined) {

// //console.log("mediaRulesOriginalValues == undefined");
//                         //Vamos criar um array para guardar os valores.
//                         mediaRulesOriginalValues = new Array();

//                         //Vamos fazer uma copia dos valores originais.
//                         for (l = 0; l < mediaRules.length; l++) {
//                             //Esta manhozisse e por causa do IE que obriga a utilizacao da funcao item para obter o elemento.
//                             mediaRulesOriginalValues.push(mediaRules[l] != undefined ? mediaRules[l] : mediaRules.item(l));
//                         }

//                         //Vamos os valores originais na lista de MediaRules.
//                         mediaRules.originalValues = mediaRulesOriginalValues;
// //console.log("mediaRules.originalValues = %s;", mediaRulesOriginalValues);
//                     }

// //console.log("mediaRules.length = %d;", mediaRules.length);
//                     //Vamos percorrer a lista de MediaRules.
//                     var max = mediaRules.length;
//                     for (k = 0; k < max; k++) {
//                         var newMediaRule = updateMediaRuleEmByFactor(mediaRulesOriginalValues[k], factor);
//                         //Only update if the rule changed something.
//                         //if (mediaRulesOriginalValues[k] != newMediaRule) {
// //console.log("var newMediaRule = %s;", newMediaRule);
//                         if ((mediaRules[0] != undefined ? mediaRules[0] : mediaRules.item(0)) != newMediaRule) {
//                             mediaRules.appendMedium("screen and (max-width: 0px)");
//                             mediaRules.appendMedium(newMediaRule);
//                             //Esta manhozisse e por causa do IE que obriga a utilizacao da funcao item para obter o elemento.
//                             //mediaRules.deleteMedium(mediaRules[0] != undefined ? mediaRules[0] : mediaRules.item(0));
// //console.log("mediaRules.appendMedium(newMediaRule);");
// ///console.log("###################################################");
//                         }
//                     }

//                     //DELETE AFTER TEST
//                     //Vamos percorrer a lista de MediaRules.
//                     //for (k = 0; k < mediaRules.length; k++)
//                     //    document.write(cssRule.media[k] + '</br>');

//                 }
//             }
//         }
//     }
// }

//Returns the viewing angle in degrees.
function calculateViewingAngle(distance, diameter)
{
    return 2 * Math.atan(diameter / (2 * distance) ) * 57.2957795;
}

//Retuns the number of pixels per inch.
function calculateScreenDefinition(screenSizeDiagonal) {
    var screenDiagonal = Math.sqrt(Math.pow(screen.width, 2) + Math.pow(screen.height, 2));
    return screenDiagonal / screenSizeDiagonal;
}

//Shows the message near the icon.
function showAsDesignedBubbleMessage() {

}

//############################################################################
//############################################################################
//                       Author data - Refernce values
//############################################################################
//############################################################################

//Variable where we store the author definitions used as a refence point.
var authorSettings = {
    screenDefinition: 147.0230825775055,
    viewingDistance: 20
}

//############################################################################
//############################################################################
//                          Cookie Control
//############################################################################
//############################################################################

//Lets read the cookies data. 
var AsDesignedSavedData = function () {
        this.status = $.cookie('asDesignedStatus');
        this.screenSizeDiagonal = $.cookie('asDesignedScreenSizeDiagonal');
        this.device = $.cookie('asDesignedDevice');
        this.viewingDistance = $.cookie('asDesignedViewingDistance');
        this.userReadability = $.cookie('asDesignedUserReadability');

        this.save = function() {
            $.cookie('asDesignedStatus', this.status, { expires: 9999, path: '/' });
            $.cookie('asDesignedScreenSizeDiagonal', this.screenSizeDiagonal, { expires: 9999, path: '/' });
            $.cookie('asDesignedDevice', this.device, { expires: 9999, path: '/' });
            $.cookie('asDesignedViewingDistance', this.viewingDistance, { expires: 9999, path: '/' });
            $.cookie('asDesignedUserReadability', this.userReadability, { expires: 9999, path: '/' });
        }
    }

var asDesignedSavedData = new AsDesignedSavedData();

//############################################################################
//############################################################################
//                          AsDesigned First Message
//############################################################################
//############################################################################

//We will use this variable to control the message view.
var asDesignedFirstMessageViewModel = null;

function showAsDesignedFirstMessage() {
    //Lets show the top panel with the message.
    $(function(){
        asDesignedFirstMessageViewModel = new AsDesignedFirstMessageViewModel();
        ko.applyBindings(asDesignedFirstMessageViewModel, $('#asDesigned-first-message').get(0));
        $('#asDesigned-first-message').slideDown();
    });
}

function hideAsDesignedFirstMessage() {
    $('#asDesigned-first-message').slideUp();
    ko.cleanNode($('#asDesigned-first-message').get(0));
    asDesignedFirstMessageViewModel = null;
}

var AsDesignedFirstMessageViewModel = function() {
    //Action - Yes
    this.actionYes = function() {
        hideAsDesignedFirstMessage();
        showAsDesignedInterface();
    }
    //Action - No
    this.actionNo = function() {
        hideAsDesignedFirstMessage();
        asDesignedSavedData.status = 'off';
        asDesignedSavedData.save();
        showBubbleMessage(); 
    }
    //Action - Later
    this.actionLater = function() {
        hideAsDesignedFirstMessage();
        showAsDesignedBubbleMessage();
    }
}

//############################################################################
//############################################################################
//                          AsDesigned Interface
//############################################################################
//############################################################################

//We will use this variable to control the message view.
var asDesignedInterfaceViewModel = null;

function showAsDesignedInterface() {
    //Lets show the top panel with the message.
    $(function(){
        asDesignedInterfaceViewModel = new AsDesignedInterfaceViewModel();
        ko.applyBindings(asDesignedInterfaceViewModel, $('#asDesigned-interface').get(0));
        $('#asDesigned-interface').slideDown();
    });
}

function hideAsDesignedInterface() {
    $('#asDesigned-interface').slideUp();
    ko.cleanNode($('#asDesigned-interface').get(0));
    asDesignedInterfaceViewModel = null;
}

function isValidNumericField(newvalue, query) {
    var isNumberExp = /^-{0,1}\d*\.{0,1}\d+$/;

    var isValid = isNumberExp.test("0" + newvalue);

    if(isValid) $(query).css('border-color', '');
    else $(query).css('border-color', '#EC79A7');

    return isValid;
}                

//Class with the device information.
function DeviceInfo(id, description, viewingDistance)
{
    this.id = id;
    this.description = description;
    this.viewingDistance = viewingDistance;
}

var AsDesignedInterfaceViewModel = function() {
    
    var self = this;

    this.devicesList = [
        new DeviceInfo("", "notset", ""),
        new DeviceInfo("SmartPhone", "SmartPhone", 15),
        new DeviceInfo("Tablet", "Tablet", 18),
        new DeviceInfo("Laptop", "Laptop", 20),
        new DeviceInfo("Desktop", "Desktop", 24),
        new DeviceInfo("TV", "TV", 0),
        new DeviceInfo("Other", "Other", 0)
        ];
    this.devicesList.find = function(id) {
        for(i = 0; i < this.length; i++)
            if(this[i].id === id) return this[i];
        return this[0];
    };

    //User input data
    this.screenSizeDiagonal = ko.observable("").extend({validateNumber: ""});
    this.device =  ko.observable("notset");
    this.viewingDistance = ko.observable("");
    this.userReadability = ko.observable(100);

    if(asDesignedSavedData.status === 'on') {
        this.screenSizeDiagonal(asDesignedSavedData.screenSizeDiagonal);
        this.device(asDesignedSavedData.device);
        this.viewingDistance(asDesignedSavedData.viewingDistance);
        this.userReadability(asDesignedSavedData.userReadability);
    }

    //Automatically obtained data
    this.screenWidth = ko.observable(screen.width);
    this.screenHeight = ko.observable(screen.height);

    this.isValid = ko.computed(function() {
        var isValid = isValidNumericField(this.screenSizeDiagonal(), '#screenSizeDiagonal');
        isValid = isValidNumericField(this.viewingDistance(), '#viewingDistance') && isValid;
        isValid = isValidNumericField(this.userReadability(), '#userReadability') && isValid;

        if(isValid) {
            $('#actionPreview').show();
            $('#actionSave').show();
        } else {
            $('#actionPreview').hide();
            $('#actionSave').hide();
        }

        return isValid;
    }, this);

    //Set the default viewing distance for the selected device.
    this.device.subscribe(function(newvalue) {
        var selectedDevice = self.devicesList.find(newvalue);
        var defaultViewingDistance = selectedDevice.viewingDistance;
        if(selectedDevice.id == "TV") defaultViewingDistance = Math.round(1.5 * self.screenSizeDiagonal());
        self.viewingDistance(defaultViewingDistance);
    });

    //Calculated data
    //this.screenDiagonal = ko.computed(function() {
    //        return Math.sqrt(Math.pow(this.screenWidth(), 2) + Math.pow(this.screenHeight(), 2));
    //    }, this);
    
    //this.screenDefinition = ko.computed(function() {
    //        return this.screenDiagonal() / this.screenSizeDiagonal();
    //    }, this);

    //Now lets calculate the author/user ratio

    //For tests only REMOVE.

//    this.adjustValue = ko.computed(function() {
//            return calculateViewingAngle(this.authorViewingDistance(), 1) /
//                calculateViewingAngle(this.viewingDistance(), 1) *
//                this.userReadability();
//        }, this);

//    this.screenDefinitionRatio = ko.computed(function() {
//            return this.screenDefinition() / this.authorScreenDefinition() * this.adjustValue();
//        }, this);
  
//    this.viewingAngle = ko.computed(function() {
//            return calculateViewingAngle(this.viewingDistance(), this.screenSizeDiagonal());
//        }, this);

    //Action - Preview
    this.actionPreview = function() {
        applyAsDesignedAdjustment(this.screenSizeDiagonal(), this.viewingDistance(), this.userReadability());
    }

    //Action - Save
    this.actionSave = function() {
        //hideAsDesignedInterface();

        asDesignedSavedData.status = 'on';
        asDesignedSavedData.screenSizeDiagonal = this.screenSizeDiagonal();
        asDesignedSavedData.device = this.device();
        asDesignedSavedData.viewingDistance = this.viewingDistance();
        asDesignedSavedData.userReadability = this.userReadability();
        asDesignedSavedData.save();

        applyAsDesignedAdjustment(this.screenSizeDiagonal(), this.viewingDistance(), this.userReadability());
        showAsDesignedBubbleMessage();
    }

    //Action - Cancel
    this.actionCancel = function() {
        //Lets check if the user already had some settings.
        if(asDesignedSavedData.status != null) {
            applyAsDesignedAdjustment(
                asDesignedSavedData.screenSizeDiagonal,
                asDesignedSavedData.viewingDistance,
                asDesignedSavedData.userReadability);
        }
        else { //Lets reset it to 1
            try {    
                $('html').css('font-size', '1em');
                updateMediaRulesEmByFactor(1);
            }
            catch(e) { }
        }

        //hideAsDesignedInterface();
        showAsDesignedBubbleMessage();
    }
}

function applyAsDesignedAdjustment(screenSizeDiagonal, viewingDistance, userReadability) {

    //Values of adjustment - defaults.
    var resolutionAdjustment = 1;
    var viewingDistanceAdjustment = 1;
    var userZoomAdjustment = 1;

    // [X] - Resolution
    if(screenSizeDiagonal != null && screenSizeDiagonal != '')
        resolutionAdjustment = calculateScreenDefinition(screenSizeDiagonal) / authorSettings.screenDefinition;
    
    // [X] - Viewing distance
    if(viewingDistance != null && viewingDistance != '')
        viewingDistanceAdjustment =
        calculateViewingAngle(authorSettings.viewingDistance, 1) / calculateViewingAngle(viewingDistance, 1);

    // [X] - Zoom
    if(userReadability != null && userReadability != '')
        userZoomAdjustment = userReadability / 100;

    //Lets calculate the global adjustment.
    var adjustValue = resolutionAdjustment * viewingDistanceAdjustment * userZoomAdjustment;

    try {    
        $('html').css('font-size', adjustValue + 'em');
        updateMediaRulesEmByFactor(adjustValue);
    }
    catch(e) { }
}

//############################################################################
//############################################################################
//                          Initialization
//############################################################################
//############################################################################

function asDesigned(authorScreenDefinition, authorViewingDistance)
{
    // Handler for .ready() called.
    $(function() {
        authorSettings.screenDefinition = authorScreenDefinition;
        authorSettings.viewingDistance = authorViewingDistance;

        if(asDesignedSavedData.status === 'on') {
            applyAsDesignedAdjustment(
                asDesignedSavedData.screenSizeDiagonal, asDesignedSavedData.viewingDistance, asDesignedSavedData.userReadability);
        }
    });    //Sets the author data.

    //Lets check if we have already some settings.
//    if(asDesignedSavedData.status === null)
//    {
//        showAsDesignedFirstMessage();
//    }

    showAsDesignedInterface();

    //$.cookie('asDesignedStatus', 'You need glasses!', { expires: 9999, path: '/' });
    //$.removeCookie('asDesignedStatus');    
}

	//var screenWidth = screen.width;
	//var screenHeight = screen.height;
	//var screenDiagonal = Math.sqrt(Math.pow(screen.width, 2) + Math.pow(screen.height, 2));

	//$('#screen-width').val(screenWidth.toString());
	//$('#screen-height').val(screenHeight.toString());
	//$('#screen-diagonal').val(screenDiagonal.toString());

	//User Input
    //$('#screen-size-diagonal').val(15.4);
	//$('#screen-size-diagonal').val(3.5);

	//var screenDefinition = screenDiagonal / parseFloat($('#screen-size-diagonal').val());

	//$('#screen-definition').val(screenDefinition);

	//Now lets calculate the author/user ratio

	//var authorScreenDefinition = parseFloat($('#author-screen-definition').val());
	//var screenDefinitionRatio = screenDefinition / authorScreenDefinition;

	//$('#screen-definition-ratio').val(screenDefinitionRatio);

	//$('html').css('font-size', screenDefinitionRatio.toString() + 'em');
	//$('#asDesigned').css('font-size', screenDefinitionRatio.toString() + 'em');

	//updateMediaRulesEmByFactor(screenDefinitionRatio);

