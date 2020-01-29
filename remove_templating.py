import re

with open( 'index.html.twig' , 'r') as f:
    content = f.read()
    reg = r'\{\{.*?\}\}'
    notwig = re.sub(reg, '', content)
    notwig = notwig.replace('{#', '<!--').replace('#}', '-->')
    notwig = notwig.replace('{%', '<!-- [twig template]').replace('%}', '-->')

    with open( 'index.html', 'w') as fp:
        fp.write( notwig )
