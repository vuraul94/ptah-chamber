// create-widget.js
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

/**
 * Generates different name formats from a kebab-case string.
 * @param {string} name - The name in kebab-case (e.g., "my-widget").
 * @returns {object} An object with names in various formats.
 */
function formatNames(name) {
    // 'my-widget' -> 'My Widget'
    const titleName = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // 'my-widget' -> 'My_Widget'
    const className = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('_');

    // 'my-widget' -> 'my_widget' (for PHP functions and variables)
    const snakeCaseName = name.replace(/-/g, '_');

    // 'my-widget' -> 'MyWidget' (for the PHP Class name)
    const pascalCaseName = className.replace(/_/g, '');

    // 'my-widget' -> 'myWidget' (for JS functions and variables)
    const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);

    return { titleName, className, snakeCaseName, pascalCaseName, camelCaseName };
}

async function createWidget() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the widget name (in kebab-case, e.g., "my-widget")?',
            validate: input => {
                if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input)) {
                    return true;
                }
                return 'Please enter a name in kebab-case format (e.g., "my-widget").';
            },
        },
    ]);

    const widgetNameKebab = answers.name;
    const { titleName, snakeCaseName, pascalCaseName, camelCaseName } = formatNames(widgetNameKebab);
    const widgetPath = path.join('widgets', widgetNameKebab);

    if (await fs.pathExists(widgetPath)) {
        console.error(`❌ Widget "${widgetNameKebab}" already exists.`);
        return;
    }

    console.log(`🚀 Creating widget: ${titleName}`);

    // Create directories
    await fs.mkdirp(path.join(widgetPath, 'templates'));

    // Template and destination paths
    const templateDir = 'widgets/example';
    const filesToCreate = [
        { template: `${templateDir}/example.php`, destination: `${widgetPath}/${widgetNameKebab}.php` },
        { template: `${templateDir}/example.js`, destination: `${widgetPath}/${widgetNameKebab}.js` },
        { template: `${templateDir}/example.css`, destination: `${widgetPath}/${widgetNameKebab}.css` },
        { template: `${templateDir}/templates/view.php`, destination: `${widgetPath}/templates/view.php` },
    ];

    // Process and create files
    for (const file of filesToCreate) {
        let content = await fs.readFile(file.template, 'utf8');
        
        // Replacements ordered from most specific to most generic to avoid errors
        content = content
            .replace(/Example_Widget/g, `${pascalCaseName}_Widget`)                  // PHP Class: MyWidget_Widget
            .replace(/register_example_scripts/g, `register_${snakeCaseName}_scripts`) // PHP function: register_my_widget_scripts
            .replace(/example-widget\.default/g, `${widgetNameKebab}.default`)       // JS Hook: my-widget.default
            .replace(/'example-script'/g, `'${widgetNameKebab}-script'`)            // Script handle
            .replace(/'example-styles'/g, `'${widgetNameKebab}-style'`)           // CSS handle
            .replace(/exampleHandler/g, `${camelCaseName}Handler`)                  // JS function: myWidgetHandler
            .replace(/__\('Example', 'ptah-chamber'\)/g, `__('${titleName}', 'ptah-chamber')`) // Widget Title
            .replace(/example_text/g, `${snakeCaseName}_text`)                      // PHP control and variable
            .replace(/\.example/g, `.${widgetNameKebab}`)                           // CSS selector
            .replace(/class="example"/g, `class="${widgetNameKebab}"`)              // HTML class
            .replace(/'example'/g, `'${widgetNameKebab}'`);                         // Widget name (get_name)
        
        await fs.writeFile(file.destination, content, 'utf8');
        console.log(`✅ Created: ${file.destination}`);
    }

    // Update ptah-chamber.php
    const pluginFile = 'ptah-chamber.php';
    let pluginContent = await fs.readFile(pluginFile, 'utf8');
    const newWidgetRequire = `require_once plugin_dir_path(__FILE__) . '/widgets/${widgetNameKebab}/${widgetNameKebab}.php';\n// WIDGETS_HOOK`;
    pluginContent = pluginContent.replace('// WIDGETS_HOOK', newWidgetRequire);
    await fs.writeFile(pluginFile, pluginContent, 'utf8');
    console.log(`✅ Updated: ${pluginFile}`);

    console.log(`\n🎉 Widget "${titleName}" created successfully!`);
    console.log(`\n👉 Don't forget to run 'npm run build' to compile the new files.`);
}

createWidget();