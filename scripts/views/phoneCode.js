module.exports = UM.Views.InputSelectOption.extend({
    template: _.template('<img src="<%= img %>" class="um-dropdown-img img-flag"><span class="um-phone-code">+<%= code %></span><span><%= country %></span>')
});