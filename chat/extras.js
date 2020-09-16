// Add isEmpty function to String
String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

// Add replaceAt function to String 
// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(a, b) {
		this.split(a).join(b);
	}
}