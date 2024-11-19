FROM node:lts 

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install PM2 globally
#RUN npm install --global pm2

# Installing dependencies
COPY ./package*.json ./
RUN yarn 

# Copying source files
COPY . .

# Building app
#RUN yarn build
EXPOSE 3000

# Running the app
CMD ["yarn", "dev"] 
#CMD "npm" "start" 