/**
 * Middleware de controle de acesso por papel (role)
 * Uso: roleMiddleware('funcionario') ou roleMiddleware('cliente', 'funcionario')
 */
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        error: 'Acesso negado. Você não tem permissão para esta ação.',
        requerido: rolesPermitidos,
        atual: req.usuario.tipo,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
