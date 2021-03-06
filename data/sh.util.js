var StravaHelper = (function(sh, $, window, document) {

    var logger = new sh.Logger("ui.util");

    var isUserPremium = false;
    var loggedInAthleteId = "";

    sh.util = {
        init: function() {
            setUserLevel();
            setLoggedInAthleteId();
        },

        isIFrame: function() {
            return window.frames.length === 0 && parent.frames.length === 1;
        },

        isCurrentPage: function(fragments) {
            var fragment = document.location.pathname.split('/')[1];

            if (fragments.indexOf(fragment) > -1) {
                return true;
            }

            return false;
        },

        isElementInView: function(element) {
            var $element = $(element);
            var $window = $(window);

            var docViewTop = $window.scrollTop();
            var docViewBottom = docViewTop + $window.height();

            var elementTop = $element.offset().top;
            var elementBottom = elementTop + $element.height();

            return ((elementBottom <= docViewBottom) && (elementTop >= docViewTop));
        },

        isLoggedIn: function() {
            return $('.user-menu').length > 0;
        },

        getActivityId: function() {
            var regexp = /activities\/(\d+)/;
            var path = document.location.pathname;
            var match = path.match(regexp);

            if (match.length === 2) {
                    return match[1];
            }

            throw "Cannot extract activity ID from path: " + path;
        },

        getAthleteIdFromUrl: function(url) {
            var match = url.match(/\/athletes\/(\d+)/)

            if (match.length === 2) {
                return match[1];
            }

            throw "Cannot extract athlete ID from url: " + url;
        },

        getActivityIdFromUrl: function(url) {
            var match = url.match(/\/activities\/(\d+)/)

            if (match.length === 2) {
                return match[1];
            }

            throw "Cannot extract activity ID from url: " + url;
        },

        timer: function(label) {
            var logger = new sh.Logger('timer-' + label);
            var start = new Date();
            return {
                stop: function() {
                    var end = new Date();
                    var time = end - start;
                    logger.debug('timer stopped: ' + time + 'ms.');
                }
            }
        },

        isUserPremium: function() {
            return isUserPremium;
        },

        ownProfilePage: function() {
            var profileAthleteId = sh.util.getAthleteIdFromUrl(document.location.pathname);

            return loggedInAthleteId === profileAthleteId;
        },

        ownActivityPage: function() {
            var activityAthleteUrl = $('span.title a[href^="/athletes"]').attr('href');
            var activityAtheleteId = sh.util.getAthleteIdFromUrl(activityAthleteUrl);

            return loggedInAthleteId === activityAtheleteId;
        }
    };

    function setUserLevel() {
        var getPremiumLink = $(".user-nav > li.upgrade");
        // when the "get premium" link in the top navbar is
        // not visible then the user is a premium member
        isUserPremium = getPremiumLink.length === 0;

        logger.debug("user is " + (isUserPremium ? "" : "not") + " premium");
    }

    function setLoggedInAthleteId() {
        loggedInAthleteId = sh.util.getAthleteIdFromUrl($('ul.user-nav a[href^="/athletes"]').attr('href'));
    }

    return sh;
}(StravaHelper, $, window, document));
