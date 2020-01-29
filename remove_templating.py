import re

with open( 'index.html.twig' , 'r') as f:
    content = f.read()

    reg = r'\{\{.*?\}\}'

    notwig = content.replace("{{ block('head_brand') }}", '<meta charset="utf-8" />')
    notwig = re.sub(reg, '', notwig)
    notwig = notwig.replace('{#', '<!--').replace('#}', '-->')
    notwig = notwig.replace('{%', '<!-- [twig template]').replace('%}', '-->')

    with open( 'index.html', 'w') as fp:
        fp.write( notwig )
