#!/usr/bin/env node
/**
 * Shopify Collection & Product Setup Script
 *
 * This script uses the Shopify Admin API to:
 * 1. Create Light Humor and Dark Humor collections
 * 2. Create sample products with proper tags
 * 3. Configure inventory settings
 *
 * Prerequisites:
 * - Shopify Admin API access token
 * - Store URL (mystore.myshopify.com)
 *
 * Usage:
 *   node setup_collections.js
 */

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'YOUR_STORE.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';

async function shopifyRequest(endpoint, method = 'POST', body = null) {
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: body }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error('❌ API Error:', JSON.stringify(data.errors, null, 2));
    throw new Error('Shopify API request failed');
  }

  return data;
}

async function createCollection(title, handle, description, tag) {
  console.log(`\n📦 Creating collection: ${title}...`);

  const mutation = `
    mutation {
      collectionCreate(input: {
        title: "${title}"
        handle: "${handle}"
        descriptionHtml: "${description}"
        ruleSet: {
          appliedDisjunctively: false
          rules: [
            {
              column: TAG
              relation: EQUALS
              condition: "${tag}"
            }
          ]
        }
      }) {
        collection {
          id
          handle
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyRequest('/admin/api/2024-01/graphql.json', 'POST', mutation);

  if (result.data.collectionCreate.userErrors.length > 0) {
    console.error('❌ Collection creation errors:', result.data.collectionCreate.userErrors);
    return null;
  }

  console.log(
    `✅ Created: ${result.data.collectionCreate.collection.title} (${result.data.collectionCreate.collection.handle})`
  );
  return result.data.collectionCreate.collection;
}

async function createProduct(title, description, price, tag) {
  console.log(`\n🎨 Creating product: ${title}...`);

  const mutation = `
    mutation {
      productCreate(input: {
        title: "${title}"
        descriptionHtml: "${description}"
        vendor: "Danliora"
        productType: "T-Shirt"
        tags: ["${tag}"]
        variants: [
          {
            price: "${price}"
            inventoryPolicy: CONTINUE
            inventoryManagement: null
          }
        ]
        status: ACTIVE
      }) {
        product {
          id
          title
          handle
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyRequest('/admin/api/2024-01/graphql.json', 'POST', mutation);

  if (result.data.productCreate.userErrors.length > 0) {
    console.error('❌ Product creation errors:', result.data.productCreate.userErrors);
    return null;
  }

  console.log(`✅ Created: ${result.data.productCreate.product.title} (${result.data.productCreate.product.handle})`);
  console.log(`   Tags: ${result.data.productCreate.product.tags.join(', ')}`);
  return result.data.productCreate.product;
}

async function main() {
  console.log('🚀 Danliora Collection Setup\n');
  console.log(`Store: ${SHOPIFY_STORE}`);

  if (!SHOPIFY_ACCESS_TOKEN || SHOPIFY_ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN') {
    console.error('\n❌ Missing Shopify credentials!');
    console.log('\n📝 Setup Instructions:');
    console.log('1. Go to Shopify Admin → Settings → Apps and sales channels');
    console.log('2. Click "Develop apps" → "Allow custom app development"');
    console.log('3. Click "Create an app" → Name it "Collection Setup"');
    console.log('4. Go to Configuration → Admin API → Enable:');
    console.log('   - write_products');
    console.log('   - write_publications');
    console.log('5. Install app → Copy Admin API access token');
    console.log('6. Set environment variables:');
    console.log('   $env:SHOPIFY_STORE="yourstore.myshopify.com"');
    console.log('   $env:SHOPIFY_ACCESS_TOKEN="shpat_xxxxx"');
    console.log('7. Run: node setup_collections.js\n');
    process.exit(1);
  }

  try {
    // Create collections
    const lightCollection = await createCollection(
      'Light Humor',
      'light-humor',
      'Sarcastic optimism for sunnier days',
      'light'
    );

    const darkCollection = await createCollection(
      'Dark Humor',
      'dark-humor',
      'Pitch-black jokes, midnight cotton',
      'dark'
    );

    // Create sample products
    console.log('\n\n🎨 Creating Sample Products...\n');

    await createProduct(
      'Existential Crisis T-Shirt',
      '<p>Because sometimes Monday feels like an entire philosophical debate.</p>',
      '28.00',
      'dark'
    );

    await createProduct(
      'Sarcasm Loading... Please Wait',
      "<p>Perfect for when you need people to know you're buffering your cynicism.</p>",
      '28.00',
      'light'
    );

    await createProduct(
      'Void Stare™ Hoodie',
      '<p>For when you want to look into the abyss AND stay warm.</p>',
      '48.00',
      'dark'
    );

    await createProduct(
      'Optimistically Pessimistic',
      "<p>Glass half-empty, but at least there's a glass.</p>",
      '28.00',
      'light'
    );

    console.log('\n\n✅ Setup Complete!\n');
    console.log('📋 Next Steps:');
    console.log('1. Go to Shopify Admin → Products → verify all 4 products exist');
    console.log('2. Go to Collections → verify Light Humor & Dark Humor collections');
    console.log('3. Products should auto-populate in collections based on tags');
    console.log('4. In Theme Customizer → Theme Settings → Astra Dev → toggle "Force products in stock" ON');
    console.log('5. Visit your homepage to test the "Shop Light" / "Shop Dark" buttons\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the script
main();
