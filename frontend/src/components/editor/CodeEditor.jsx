import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

const CodeEditor = ({ activeFile, doc, provider, language }) => {
  const bindingRef = useRef(null);

  const registerSnippets = (monaco) => {
    if (window.snippetsRegistered) return;
    window.snippetsRegistered = true;

    const snippets = {
      javascript: [
        { label: 'clg', insertText: 'console.log($1);', detail: 'console.log()', documentation: 'Prints output to the console' },
        { label: 'fn', insertText: 'function ${1:name}(${2:params}) {\n\t$0\n}', detail: 'function declaration', documentation: 'Declares a standard function' },
        { label: 'afn', insertText: 'const ${1:name} = (${2:params}) => {\n\t$0\n};', detail: 'arrow function', documentation: 'Declares an ES6 arrow function' },
        { label: 'fori', insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t$0\n}', detail: 'for loop', documentation: 'Standard incremental for loop' },
        { label: 'if', insertText: 'if (${1:condition}) {\n\t$0\n}', detail: 'if statement', documentation: 'Conditional block' },
        { label: 'ife', insertText: 'if (${1:condition}) {\n\t$2\n} else {\n\t$0\n}', detail: 'if-else statement', documentation: 'Conditional if-else block' },
        { label: 'prom', insertText: 'new Promise((resolve, reject) => {\n\t$0\n});', detail: 'Promise constructor', documentation: 'Creates a new ES6 Promise' }
      ],
      python: [
        { label: 'def', insertText: 'def ${1:name}(${2:params}):\n\t${0:pass}', detail: 'function definition', documentation: 'Defines a Python function' },
        { label: 'main', insertText: 'if __name__ == "__main__":\n\t${0:main()}', detail: 'main check', documentation: 'Standard main module execute block' },
        { label: 'for', insertText: 'for ${1:i} in range(${2:limit}):\n\t$0', detail: 'for loop', documentation: 'Incremental range loop' },
        { label: 'if', insertText: 'if (${1:condition}):\n\t$0', detail: 'if statement', documentation: 'Conditional execution' },
        { label: 'print', insertText: 'print(${1:message})', detail: 'print', documentation: 'Prints to console' },
        { label: 'imp', insertText: 'import ${1:module}', detail: 'import statement', documentation: 'Imports a library' }
      ],
      cpp: [
        { label: 'cout', insertText: 'std::cout << ${1:message} << std::endl;', detail: 'cout expression', documentation: 'Prints output to standard stream' },
        { label: 'main', insertText: 'int main() {\n\t$0\n\treturn 0;\n}', detail: 'main entrypoint', documentation: 'C++ main execution structure' },
        { label: 'for', insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:limit}; ${1:i}++) {\n\t$0\n}', detail: 'for loop', documentation: 'Incremental for loop' },
        { label: 'if', insertText: 'if (${1:condition}) {\n\t$0\n}', detail: 'if block', documentation: 'Conditional statement' },
        { label: 'inc', insertText: '#include <${1:iostream}>', detail: '#include', documentation: 'Includes standard library headers' },
        { label: 'vec', insertText: 'std::vector<${1:type}> ${2:name};', detail: 'std::vector', documentation: 'Declares a dynamic array vector' }
      ],
      c: [
        { label: 'printf', insertText: 'printf("${1:%s}\\n", ${2:val});', detail: 'printf expression', documentation: 'Prints formatted output to stdout' },
        { label: 'main', insertText: 'int main() {\n\t$0\n\treturn 0;\n}', detail: 'main entrypoint', documentation: 'C main execution structure' },
        { label: 'for', insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:limit}; ${1:i}++) {\n\t$0\n}', detail: 'for loop', documentation: 'Incremental for loop' },
        { label: 'if', insertText: 'if (${1:condition}) {\n\t$0\n}', detail: 'if block', documentation: 'Conditional statement' },
        { label: 'inc', insertText: '#include <${1:stdio.h}>', detail: '#include', documentation: 'Includes standard C library headers' }
      ],
      java: [
        { label: 'sout', insertText: 'System.out.println(${1:message});', detail: 'System.out.println', documentation: 'Prints output to console with newline' },
        { label: 'psvm', insertText: 'public static void main(String[] args) {\n\t$0\n}', detail: 'main method', documentation: 'Java program entry point' },
        { label: 'class', insertText: 'public class ${1:Name} {\n\t$0\n}', detail: 'class declaration', documentation: 'Declares a public class' },
        { label: 'for', insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:limit}; ${1:i}++) {\n\t$0\n}', detail: 'for loop', documentation: 'Standard integer loop' },
        { label: 'if', insertText: 'if (${1:condition}) {\n\t$0\n}', detail: 'if statement', documentation: 'Conditional statement' }
      ]
    };

    snippets.typescript = snippets.javascript;

    Object.keys(snippets).forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions = snippets[lang].map((item) => ({
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            insertText: item.insertText,
            detail: item.detail,
            documentation: item.documentation,
            range: range
          }));

          return { suggestions };
        }
      });
    });
  };

  const handleMount = (editor, monaco) => {
    registerSnippets(monaco);

    // Extract the text content for the specific file from the shared document
    const yText = doc.getText(activeFile);

    // User awareness state is now managed by EditorPage

    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().entries());
      let cssText = `
        .monaco-editor .view-overlays {
          overflow: visible !important;
        }
      `;
      states.forEach(([clientId, state]) => {
        if (state.user) {
          cssText += `
            .yRemoteSelection-${clientId} {
              background-color: ${state.user.color}40;
            }
            .yRemoteSelectionHead-${clientId} {
              position: absolute;
              border-left: 2px solid ${state.user.color};
              box-sizing: border-box;
              z-index: 10;
            }
            .yRemoteSelectionHead-${clientId}::after {
              position: absolute;
              content: '${state.user.name}';
              background-color: ${state.user.color};
              color: #fff;
              font-family: sans-serif;
              font-size: 11px;
              font-weight: 600;
              padding: 2px 6px;
              border-radius: 4px;
              border-bottom-left-radius: 0;
              top: -18px;
              left: 0;
              white-space: nowrap;
              pointer-events: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          `;
        }
      });
      
      let styleTag = document.getElementById("y-monaco-cursors");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "y-monaco-cursors";
        document.head.appendChild(styleTag);
      }
      styleTag.innerHTML = cssText;
    });

    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );
  };

  useEffect(() => {
    return () => {
      if (bindingRef.current) bindingRef.current.destroy();
      // DO NOT destroy provider or doc here, as they are managed by EditorPage
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        onMount={handleMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;