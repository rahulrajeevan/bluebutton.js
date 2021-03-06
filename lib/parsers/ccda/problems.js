/*
 * Parser for the CCDA problems section
 */

var Core = require('../../core');

module.exports = function(doc) {
  var self = this;
  self.doc = doc;

  self.problems = function (ccda) {
    
    var parseDate = self.doc.parseDate;
    var parseName = self.doc.parseName;
    var parseAddress = self.doc.parseAddress;
  
    var problems = ccda.section('problems');
  
    var data = {}, el;
    data.entries = [];
    data.displayName = "Problems";
    data.templateId = problems.tag('templateId').attr('root');
    data.text = problems.tag('text').val(true);
    
    problems.entries().each(function(entry) {
      
      el = entry.tag('effectiveTime');
      var start_date = parseDate(el.tag('low').attr('value')),
          end_date = parseDate(el.tag('high').attr('value'));
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('value');
      var name = el.attr('displayName'),
          code = el.attr('code'),
          code_system = el.attr('codeSystem'),
          code_system_name = el.attr('codeSystemName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.4').tag('translation');
      var translation_name = el.attr('displayName'),
        translation_code = el.attr('code'),
        translation_code_system = el.attr('codeSystem'),
        translation_code_system_name = el.attr('codeSystemName');
      
      el = entry.template('2.16.840.1.113883.10.20.22.4.6');
      var status = el.tag('value').attr('displayName');
      
      var age = null;
      el = entry.template('2.16.840.1.113883.10.20.22.4.31');
      if (!el.isEmpty()) {
        age = parseFloat(el.tag('value').attr('value'));
      }
  
      el = entry.template('2.16.840.1.113883.10.20.22.4.64');
      var comment = Core.stripWhitespace(el.tag('text').val());
      
      data.entries.push({
        date_range: {
          start: start_date,
          end: end_date
        },
        name: name,
        status: status,
        age: age,
        code: code,
        code_system: code_system,
        code_system_name: code_system_name,
        translation: {
          name: translation_name,
          code: translation_code,
          code_system: translation_code_system,
          code_system_name: translation_code_system_name
        },
        comment: comment
      });
    });
    
    return data;
  };
}
