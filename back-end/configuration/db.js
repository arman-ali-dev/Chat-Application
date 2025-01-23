const { connect } = require( "mongoose" );

const connectMongoDB = async ( URI ) =>
{
    await connect( URI )
}


module.exports = { connectMongoDB }