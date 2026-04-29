import re
import sys

def fix_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Replace <Link><Button></Button></Link> with <Button asChild><Link></Link></Button>
    # Note: this is a simple regex and might not catch all edge cases, but covers the most common ones.
    
    # 1. <Link to="..."><Button ...>Text</Button></Link>
    pattern1 = r'<Link([^>]*)>\s*<Button([^>]*)>(.*?)<\/Button>\s*<\/Link>'
    def replace1(match):
        link_attrs = match.group(1)
        button_attrs = match.group(2)
        inner = match.group(3)
        return f'<Button asChild{button_attrs}>\n  <Link{link_attrs}>{inner}</Link>\n</Button>'
        
    content = re.sub(pattern1, replace1, content, flags=re.DOTALL)
    
    with open(filename, 'w') as f:
        f.write(content)

for file in sys.argv[1:]:
    fix_file(file)
