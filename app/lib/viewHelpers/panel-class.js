function panelClass(options) {
  if (this.isValid) {
    return "panel panel-success";
  }
  return "panel panel-danger";
}

module.exports = panelClass;
