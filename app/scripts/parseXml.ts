import { createReadStream } from 'fs';
// @ts-ignore - sax doesn't have types
import sax from 'sax';

// Streaming XML parser that processes records incrementally
export async function parseXMLStream(
  filePath: string,
  onRecord: (record: any) => Promise<void> | void
): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`    Starting to parse XML file: ${filePath}`);
    const stream = createReadStream(filePath, { encoding: 'utf-8' });
    const parser = sax.createStream(true, {
      trim: true,
      normalize: true,
      lowercase: false,
      xmlns: false
    });

    let currentRecord: any = null;
    const stack: Array<{ obj: any; tagName: string }> = []; // Stack to track objects and their tag names
    let recordCount = 0;
    let tagCount = 0;
    
    parser.onopentag = (node: any) => {
      tagCount++;
      if (tagCount === 1) {
        console.log(`    First tag found: ${node.name}`);
      }
      if (node.name === 'ABR') {
        if (recordCount === 0) {
          console.log(`    Found first ABR at tag #${tagCount}`);
        }
        currentRecord = {};
        stack.push({ obj: currentRecord, tagName: node.name });
      } else if (currentRecord) {
        const parent = stack[stack.length - 1].obj;
        const nodeName = node.name;
        
        // Create nested object if it doesn't exist
        if (!parent[nodeName]) {
          parent[nodeName] = {};
        }
        
        // Copy attributes to the object
        if (node.attributes && typeof node.attributes === 'object') {
          for (const attrName in node.attributes) {
            parent[nodeName][attrName] = node.attributes[attrName];
          }
        }
        
        stack.push({ obj: parent[nodeName], tagName: nodeName });
      }
    };

    parser.ontext = (text: string) => {
      if (currentRecord && stack.length > 0) {
        const current = stack[stack.length - 1].obj;
        if (typeof current === 'object' && current !== null) {
          // Accumulate text content
          if (!current._text) {
            current._text = '';
          }
          current._text += text.trim();
        }
      }
    };

    parser.onclosetag = async (tagName: string) => {
      if (tagName === 'ABR' && currentRecord) {
        // Clean up the record: convert objects with only _text to strings
        const cleanValue = (value: any): any => {
          if (value === null || value === undefined) return value;
          
          // If it's an object with _text property
          if (typeof value === 'object' && !Array.isArray(value) && '_text' in value) {
            const { _text, ...rest } = value as any;
            // If only _text exists (no other properties), return just the text
            if (Object.keys(rest).length === 0) {
              return _text || '';
            }
            // If there are other properties, keep the object structure but clean nested values
            const cleaned: any = { ...rest };
            if (_text) cleaned._value = _text;
            // Recursively clean nested objects
            for (const key in cleaned) {
              if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
                cleaned[key] = cleanValue(cleaned[key]);
              }
            }
            return cleaned;
          }
          
          // If it's a regular object or array, recurse
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              return value.map(cleanValue);
            }
            const result: any = {};
            for (const key in value) {
              result[key] = cleanValue(value[key]);
            }
            return result;
          }
          
          return value;
        };
        
        const cleaned = cleanValue(currentRecord);
        recordCount++;
        if (recordCount === 1) {
          console.log(`    Processing first record...`);
        }
        await onRecord(cleaned);
        currentRecord = null;
        stack.length = 0;
      } else if (stack.length > 0) {
        // When closing a tag, if it only has _text, convert parent's reference to string
        const { obj: current, tagName: currentTagName } = stack.pop()!;
        if (current && typeof current === 'object' && '_text' in current) {
          const { _text, ...rest } = current as any;
          if (Object.keys(rest).length === 0 && _text !== undefined && stack.length > 0) {
            // This element only has text, no attributes - convert to string in parent
            const parent = stack[stack.length - 1].obj;
            if (parent && parent[currentTagName] === current) {
              parent[currentTagName] = _text || '';
            }
          }
        }
      }
    };

    parser.onerror = (err: any) => {
      stream.destroy();
      reject(err instanceof Error ? err : new Error(String(err)));
    };

    parser.onend = () => {
      console.log(`File parsing complete. Total tags: ${tagCount}, ABR elements: ${recordCount}`);
      resolve();
    };

    stream.pipe(parser);
    stream.on('error', reject);
  });
}

// Legacy function for backward compatibility (but won't work for huge files)
export async function parseXML(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseXMLStream(filePath, () => {})
      .then(() => resolve({ ABR: { ABRrecord: [] } }))
      .catch(reject);
  });
}