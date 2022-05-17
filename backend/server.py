import logging
from aiohttp import web
from aiohttp_middlewares import cors_middleware
from wall import Wall

routes = web.RouteTableDef()
logging.basicConfig(level=logging.INFO)


ACTIVE_WALLS = {}


@routes.get('/api/get_new_wall')
async def get_new_wall_handler(request):
    try:
        logging.info(request)
        wall = Wall()
        wall_data = wall.get_dict()
        wall_id = wall_data['wall_id']
        ACTIVE_WALLS[wall_id] = wall
        return web.json_response(wall_data, status=200)
    except Exception as e:
        logging.error(e)
        return web.json_response({'error': str(e)}, status=500)


@routes.post('/api/guess')
async def receive_guess_handler(request):
    try:
        logging.info(request)
        params = await request.json()
        wall_id = params['wallId']
        guess_ids = params['guessIds']
        wall = ACTIVE_WALLS[wall_id]
        wall.guess(guess_ids)
        wall_data = wall.get_dict()
        return web.json_response(wall_data, status=201)
    except Exception as e:
        logging.error(e)
        return web.json_response({'error': True, 'message': str(e)}, status=500)


app = web.Application()
app = web.Application(middlewares=[cors_middleware(allow_all=True)])
app.add_routes(routes)
web.run_app(app, host='localhost', port=5000)
