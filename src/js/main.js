// helper function to get age
var get_age = function(date_string) {
    var dob = new Date(date_string);
    var now = new Date();
    var age = now.getFullYear() - dob.getFullYear();
    var months = now.getMonth() - dob.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < now.getDate())) {
        age--;
    }
    return age >= 0 ? age : "?";
};

// cache DOM references
var $BOXES = $('.box');
var $BOXES_DIV = $('#box_div');
var $SEL_DIV = $('#sel_div');
var $LABELS = $('#group_labels span');
var $BOX_HED = $("#box_hed");
var $BILL_HED = $("#bill_hed");
var $BILL_DESC = $("#bill_desc");

// path to data
var dataUrl = "data/data.json";

// lookup object
var lookups = {
    race: {
        white_other: 'White/other',
        black: 'Black',
        hispanic: 'Hispanic',
        asian_american: 'Asian-American',
        native_american: 'Native American'
    },
    chamber: {
        house: 'House',
        senate: 'Senate'
    },
    party: {
        republican: 'Republican',
        democrat: 'Democrat'
    },
    marital: {
        married: 'Married',
        single: 'Single',
        widower: 'Widower'
    },
    education: {
        high_school: 'High School Diploma',
        associate: 'Associate Degree',
        bachelors: 'Bachelors Degree',
        masters: 'Master\'s Degree',
        doctorate: 'Doctorate'
    },
    age: {
        under30: "Under 30",
        from30_39: "30-39",
        from40_49: "40-49",
        from50_59: "50-59",
        from60_69: "60-69",
        over70: "70+"
    },
    sex: {
        male: 'Men',
        female: 'Women'
    },
    vote: {
        yes: 'Yes',
        no: 'No',
        'conostitutionoal privilege': 'Constitutional Privilege',
        excused: 'Excused'
    }
};

// set template variables and template
_.templateSettings.variable = "template_data";

var sel_tpl = _.template(
    "<div class='row'><div class='col-md-6'><select class='form-control' id='vote_select'>" +
    "<option>Select a bill</option>" +
    "<% _.each(template_data, function(d) { %>" +
    "<option value='<%= d.id %>'><%= d.bill_name %> (<%= d.bill_no %>)</option>" +    
    "<% }); %>" +
    "</select></div></div>"
);

var tpl = _.template(
    "<div class='row'>" +
    "<% _.each(template_data.data, function(d, v) { %>" +
    "<div class='item col-xs-12 col-sm-6 col-md-<%= template_data.cols %>'>" +
    "<strong><%= lookups[template_data.attr][v] %> (<%= d.length %>)</strong><br>" +
    "<% _.each(d, function(z) { %>" +
    '<div class="box <%= z.party %>" data-toggle="popover" data-placement="top" title="<%= z.name %> (Dist. <%= z.district %>)" data-content="<b>City</b>: <%= z.city %><br><b>Occupation</b>: <%= z.occupation %><br><b>Race</b>: <%= lookups.race[z.race] %><br><b>Age</b>: <%= get_age(z.dob) %><br><b>Education</b>: <%= lookups.education[z.education] %><br><b>Marital status</b>: <%= lookups.marital[z.marital] %><hr><a href=\'mailto:<%= z.email %>\'><%= z.email %></a><br><%= z.phone %>" id="<%= z.id %>"></div>' +
    "<% }); %>" +
    "</div>" +
    "<% }); %>" +
    "</div>"
);

// get data
$.getJSON(dataUrl).success(function(d) {

    // function to highlight boxes
    var highlighter = function(pol) {
        if (!pol || pol === "") {
            $('.box').removeClass('mute');
        } else {
            $('.box').addClass('mute');
            _.each(d.legislators, function(x) {
                var name = x.name.toUpperCase();
                    if (name.indexOf(pol) > -1) {
                        var $hilite = $('div#' + x.id);
                        $hilite.removeClass('mute');
                    }
            });
        }
    };

    // function to change data out
    var change_data = function() {
        $SEL_DIV.html('');
        $BILL_HED.html('');
        $BILL_DESC.html('');
        
        var grouped;
        var template_data = {};
        var attr = this.id;
        var attr_text = this.innerText;

        // swap out label colors
        $LABELS.each(function() {
            $(this).removeClass("label-primary");
            $(this).addClass("label-leg"); 
        });

        // highlight this one
        $(this).removeClass("label-leg");
        $(this).addClass("label-primary");
        
        if (attr !== "age" && attr !== "vote") {
            grouped = _.groupBy(d.legislators, attr);
        } else if (attr === "age") {
            var under_30 = [];
            var from30_39 = [];
            var from40_49 = [];
            var from50_59 = [];
            var from60_69 = [];
            var over70 = [];
            
            _.each(d.legislators, function(d) {
                if (get_age(d.dob) < 30) {
                    under_30.push(d);
                } else if (get_age(d.dob) >= 30 && get_age(d.dob) < 40) {
                    from30_39.push(d);
                } else if (get_age(d.dob) >= 40 && get_age(d.dob) < 50) {
                    from40_49.push(d);
                } else if (get_age(d.dob) >= 50 && get_age(d.dob) < 60) {
                    from50_59.push(d);
                } else if (get_age(d.dob) >= 60 && get_age(d.dob) < 70) {
                    from50_59.push(d);
                } else {
                    over70.push(d);
                }                
            });
            
            grouped = {
                under30: under_30,
                from30_39: from30_39,
                from40_49: from40_49,
                from50_59: from50_59,
                from60_69: from60_69,
                over70: over70            
            };            
        } else if (attr === "vote") {

            $SEL_DIV.html(sel_tpl(d.bills));
            
            $("#vote_select").on('change', function() {
                    var bill_id = this.value;

                    var matching_bill = _.findWhere(d.bills, { "id": bill_id });
                    
                    if (matching_bill.description) {
                        var bill = $(this).find("option:selected").text();
                        
                        $BILL_HED.html(bill);
                        $BILL_DESC.html(bill_desc);
     
                        var eligible = _.filter(d.legislators, function(q) {
                                    return _.has(q, bill_id);
                                });
     
                        var first_group = _.groupBy(eligible, bill_id);
                        
                        grouped = {};
                        
                        if (first_group.yes) {
                            grouped.yes = first_group.yes;
                        }

                        if (first_group.no) {
                            grouped.no = first_group.no;
                        }

                        if (first_group.excused) {
                            grouped.excused = first_group.excused;
                        }

                        if (first_group['conostitutionoal privilege']) {
                            grouped['conostitutionoal privilege'] = first_group['conostitutionoal privilege'];
                        }

                        template_data.attr = "vote";
                        template_data.data = grouped;
                        template_data.cols = Math.floor(12 / _.size(grouped));
                        
                        $BOXES_DIV.html(tpl(template_data));
                        
                        $('[data-toggle="popover"]').popover({
                            html: true
                        });                    
                    }
            });

        }
        
        if (attr === "education") {
            // this is the dumbest way to sort ever
            var new_obj = {};
            new_obj.doctorate = grouped.doctorate;
            new_obj.masters = grouped.masters;
            new_obj.bachelors = grouped.bachelors;
            new_obj.associate = grouped.associate;
            new_obj.high_school = grouped.high_school;            
            grouped = new_obj;
        }
        
        $BOX_HED.text(attr_text);

        template_data.attr = attr;
        template_data.data = grouped;
        template_data.cols = Math.floor(12 / _.size(grouped));
        
        $BOXES_DIV.html(tpl(template_data));
        
         $('[data-toggle="popover"]').popover({
            html: true
         });
    };

    var kill_popover = function(e) {
        $('[data-toggle="popover"]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
            }
        });         
    };

    $('body').on('click', kill_popover)
             .on('touchstart', kill_popover);
    
    $LABELS.on('click', change_data);
    $LABELS.eq(0).click();

    $('#enter').keyup(function() {
        highlighter(this.value.toUpperCase());
    });

    var twit = encodeURI("https://twitter.com/intent/tweet?text=Explore the makeup of the 2016 Oklahoma Legislature with this @OklahomaWatch interactive: " + window.location);

    var facebook = encodeURI("http://www.facebook.com/sharer.php?u=" + window.location);
    
    $("#tw").attr({
        'href': twit,
        'target': '_blank'
    });

    $("#fb").attr({
        'href': facebook,
        'target': '_blank'
    });    
    
}).fail(function() {
    alert('Something went wrong. Try reloading the page.');
});