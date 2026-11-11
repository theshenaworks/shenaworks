import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './src/collections/Users'
import { Media, EnquiryAttachments } from './src/collections/Media'
import { Services } from './src/collections/Services'
import { Projects } from './src/collections/Projects'
import { EquipmentCategories, Equipment } from './src/collections/Equipment'
import { Credentials, Team, Testimonials } from './src/collections/CredentialsTeamTestimonials'
import {
  PostCategories,
  Posts,
  Locations,
  LegalPages,
  Enquiries,
} from './src/collections/PostsLocationsLegalEnquiries'
import {
  SiteSettings,
  HomePage,
  AboutPage,
  CredentialsPage,
  ServicesIndex,
  ProjectsIndex,
  EquipmentIndex,
} from './src/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins = []

if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename: file }) =>
            `${process.env.NEXT_PUBLIC_MEDIA_URL || 'https://media.shenaworksltd.com'}/media/${file}`,
        },
        'enquiry-attachments': {
          prefix: 'private/enquiries',
        },
      },
      bucket: process.env.R2_PUBLIC_BUCKET || 'shena-media-public',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      },
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    EnquiryAttachments,
    Services,
    Projects,
    EquipmentCategories,
    Equipment,
    Credentials,
    Team,
    Testimonials,
    PostCategories,
    Posts,
    Locations,
    LegalPages,
    Enquiries,
  ],
  globals: [
    SiteSettings,
    HomePage,
    AboutPage,
    CredentialsPage,
    ServicesIndex,
    ProjectsIndex,
    EquipmentIndex,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'shena-works-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.PAYLOAD_MIGRATING === 'true'
          ? process.env.DIRECT_DATABASE_URI || process.env.DATABASE_URI
          : process.env.DATABASE_URI,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    push: false,
  }),
  plugins,
})
