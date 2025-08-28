# Vercel Environment Variables Setup

## Required Environment Variables

### Backend Variables (Set in Vercel Dashboard)

1. **DATABASE_URL**
   - Value: Your Render PostgreSQL external URL
   - Example: `postgresql://username:password@host:port/database?sslmode=require`
   - Environment: Production

2. **JWT_SECRET**
   - Value: Your JWT secret key (any secure random string)
   - Example: `your-super-secret-jwt-key-here`
   - Environment: Production

3. **NODE_ENV**
   - Value: `production`
   - Environment: Production

### Frontend Variables (Set after deployment)

1. **VITE_API_URL**
   - Value: Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`
   - Environment: Production

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click **Environment Variables**
5. Add each variable:
   - **Name**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select **Production**
   - Click **Add**

## Database Options

### Option A: Keep Render PostgreSQL (Recommended)
- Keep your existing Render PostgreSQL database
- Use the external URL in `DATABASE_URL`
- No data migration needed

### Option B: Migrate to Supabase/Neon
- Create new database on Supabase or Neon
- Export data from Render: `pg_dump your_database > backup.sql`
- Import to new database: `psql new_database < backup.sql`
- Update `DATABASE_URL` to new database URL

## Testing Your Setup

After setting environment variables:

1. **Test API endpoints:**
   ```bash
   curl https://your-app.vercel.app/api/courses
   ```

2. **Test frontend:**
   - Visit your Vercel URL
   - Check if courses load
   - Test authentication

## Troubleshooting

### Common Issues:

1. **Database connection failed**
   - Check `DATABASE_URL` format
   - Ensure SSL is enabled (`?sslmode=require`)
   - Verify database is accessible

2. **CORS errors**
   - Frontend and backend should be on same domain
   - Check `VITE_API_URL` is correct

3. **Authentication not working**
   - Verify `JWT_SECRET` is set
   - Check JWT token handling in frontend

### Debug Commands:

```bash
# Test API locally
curl http://localhost:3001/api/courses

# Test production API
curl https://your-app.vercel.app/api/courses

# Check Vercel logs
vercel logs
``` 