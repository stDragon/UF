module.exports = UM.Views.InputSelectOption.extend({
    template: _.template('<%if(preview != ""){ %><img src="<%= preview %>" alt="" class="um-dropdown-img"><%}%><span><%= name %></span>')
});