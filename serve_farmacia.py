import http.server, os
os.chdir('/Users/adrianalmeida/Desktop/Farmacia')
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=8091, bind='127.0.0.1')
