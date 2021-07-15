var Item = function(){
    var self = this;
    self.name = ko.observable("");
    self.state = ko.observable("");
    self.city = ko.observable("");
    self.cities = ko.computed(function(){
        if(self.state() == "" || self.state().cities == undefined)
            return [];
        return self.state().cities;
    });

};

var ViewModel = function(data) {
    
    ko.validation.rules['text'] = {
        validator: function (val, params) {
            var regex = /([A-Za-z])$/;
            if (regex.test(val)) {
                return true;
            }
        },
        message: 'Only Alphabets Allowed '
    };
    ko.validation.rules['pincode'] = {
        validator: function (val, params) {
            var regex = /([0-9]{6})$/;
            if (regex.test(val)) {
                   if(val.length == 6)
                        return true;
            }
        },
        message: 'Enter Valid Pin Code'
    };
    ko.validation.rules['mobile'] = {
        validator: function (val, params) {
            var regex = /^[0]?[6789]\d{9}$/;
            if (regex.test(val)) {
                   if(val.length == 10)
                        return true;
            }
        },
        message: 'Enter Valid Mobile  Number'
    };
    ko.validation.rules['mobileExits'] = {
        validator: function (val, params) {
            let flag = 0;
                var customer = JSON.parse(localStorage.getItem("customerList"));
                if (customer === null || customer === undefined) {
                    customer = []
                }
                for (let i = 0; i < customer.length; i++) {
                        if (customer[i].mobile == Number(val)) {
                            flag = 1;
                        }
                    } 
                if(flag == 0 ){
                    return true;
                }
        },
        message: ' Mobile  Number  Already Exits'
    };
    ko.validation.registerExtenders();

    var self = this;
    self.CustID=ko.observable();
    self.firstName=ko.observable().extend({required : true , text: true});
    self.lastName=ko.observable().extend({required : true , text: true});
    self.address=ko.observable().extend({required : true,text: true});
    self.pincode=ko.observable().extend({required : true , pincode: true});
    self.mobile=ko.observable().extend({required : true , mobile: true,mobileExits:true});
    self.states = data;
    self.items = ko.observableArray([new Item()]);
    self.customerList = ko.observableArray([]);

    var index;
    //for Clearing Fields
    self.clearFields = function clearFields() {
        self.firstName('');
        self.lastName('');
        self.address('');
        self.pincode('');
        self.mobile('');
    }

   
    self.errors = ko.validation.group(this, { deep: true, observable: false });
 //for adding customer
    self.addCustomer=function addCustomer()
    {
        var customer = JSON.parse(localStorage.getItem("customerList"));

        if (customer === null || customer === undefined) {
            customer = []
        }
        if (self.errors().length === 0) {

			alert('Thank you.');
            self.CustID(customer.length + 1);
            var user ={
                CustID:self.CustID(),
                firstName:self.firstName(),
                lastName:self.lastName(),
                address: self.address(),
                pincode : self.pincode(),
                mobile : self.mobile(),
                state: self.items()[0].state().name,
                city :  self.items()[0].city()   
            };
       
            customer.push(user);
            localStorage.setItem("customerList", JSON.stringify(customer));
            self.clearFields();
        
    }else{
       
            alert("Please Check the Submission");
        }
        getCustomerList();
}

    //Get Customer List
    function getCustomerList() {
        var customer = JSON.parse(localStorage.getItem("customerList"));
        //setting the customer data to customerlist array
        self.customerList(customer);
    }

    self.deleteCustomer = function (customer1,event) {
        var customer = JSON.parse(localStorage.getItem("customerList"));
        var context = ko.contextFor(event.target);
        let index=context.$index();
        customer.splice(index,1);
        alert('Customer Deleted Successfully');
        localStorage.setItem("customerList", JSON.stringify(customer))
      
    }


    getCustomerList();
};

var data = [
    {name: "Gujarat", cities: [
        "Ahmedabad", "Jamnanagar"
    ]},{name: "Maharashtra", cities: [
        "Mumbai", "Pune" 
    ]},
];

ko.applyBindings(new ViewModel(data));