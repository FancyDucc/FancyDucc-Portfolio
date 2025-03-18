from bs4 import BeautifulSoup
import os

def format_node(node, indent=0, spaces=4):
    lines = []
    prefix = ' ' * indent

    if node.name is None:
        text = (node.string or '').strip()
        if text:
            lines.append(f"{prefix}{text}")
        return "\n".join(lines)

    attrs_str = ""
    for attr_name, attr_value in node.attrs.items():
        attrs_str += f' {attr_name}="{attr_value}"'

    opening_tag = f"{prefix}<{node.name}{attrs_str}>"

    children = list(node.children)
    if not children:
        lines.append(opening_tag + f"</{node.name}>")
        return "\n".join(lines)
    
    if len(children) == 1 and children[0].name is None:
        text = (children[0].string or '').strip()
        lines.append(f"{opening_tag} {text} </{node.name}>")
        return "\n".join(lines)

    lines.append(opening_tag)
    for child in children:
        child_str = format_node(child, indent + spaces, spaces)
        if child_str:
            lines.append(child_str)
    lines.append(f"{prefix}</{node.name}>")
    return "\n".join(lines)

def beautify_html(html_content, spaces=4):
    soup = BeautifulSoup(html_content, 'html.parser')

    output_lines = []
    for top_node in soup.contents:
        node_str = format_node(top_node, 0, spaces)
        if node_str.strip():
            output_lines.append(node_str)

    return "\n".join(output_lines)

def process_html_directory(directory_path, spaces=4):
    for filename in os.listdir(directory_path):
        if filename.lower().endswith('.html'):
            filepath = os.path.join(directory_path, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                original_html = f.read()

            beautified = beautify_html(original_html, spaces=spaces)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(beautified)

    print(f"yuh {directory_path} {spaces}")

# process_html_directory("C:\\Users\\weevi\\OneDrive\\Desktop\\FancyDucc-Portfolio", spaces=3)